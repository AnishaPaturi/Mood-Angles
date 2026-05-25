import React, { useState, useRef, useEffect } from "react";
import UserWrapper from "../components/UserWrapper";
import { UploadCloud, FileUp, CheckCircle2, Tag, FileText } from "lucide-react";

function UploadD() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [category, setCategory] = useState("Other");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);
  const userId = localStorage.getItem("userId");

  const API_BASE =
    (import.meta.env.DEV
      ? import.meta.env.VITE_LOCAL_BACKEND
      : import.meta.env.VITE_PROD_BACKEND) || "http://localhost:5000";

  const CATEGORIES = ["Prescription", "Lab Report", "Psychiatrist Letter", "Insurance", "Other"];

  // ✅ Fetch uploaded files for current user
  useEffect(() => {
    if (!userId) return;
    fetch(`${API_BASE}/api/uploads?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setUploadedFiles(data))
      .catch((err) => console.error("Error fetching uploaded files:", err));
  }, [userId]);

  // File select or drop
  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length) setFiles(selectedFiles);
    setSuccess(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length) setFiles(droppedFiles);
    setSuccess(false);
  };

  const handleDragOver = (e) => e.preventDefault();

  // ✅ Upload with category
  const handleUpload = async () => {
    if (!files.length) return alert("Please select a file!");
    if (!userId) return alert("Please log in to upload files");

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("category", category);
      formData.append("userId", userId);

      const res = await fetch(`${API_BASE}/api/uploads`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setFiles([]);
        setUploadedFiles((prev) => [...prev, data.file]);
      } else {
        alert("Upload failed: " + data.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong!");
    } finally {
      setUploading(false);
      setTimeout(() => setSuccess(false), 4000);
    }
  };

// ✅ Analyze document
  const handleAnalyze = async () => {
     if (!files.length) return alert("Please select a file!");
     if (!userId) return alert("Please log in to analyze documents");

     setAnalyzing(true);
     setAnalysisResult(null);
     try {
       const formData = new FormData();
       formData.append("file", files[0]);
       formData.append("category", category); // Add category to the request

       const res = await fetch(`${API_BASE}/api/documents/analyze`, {
         method: "POST",
         body: formData,
       });

       const data = await res.json();

     if (res.ok) {
            // Check if extraction produced meaningful text
            const extractedText = data.extractedText || "";
            const extractionFailed =
              !extractedText ||
              extractedText.length < 10 ||
              extractedText.toLowerCase().includes("error") ||
              extractedText.toLowerCase().includes("missing library") ||
              extractedText.toLowerCase().includes("tesseract");

            if (extractionFailed) {
              setAnalysisResult({
                ...data,
                extractionError: true,
                extractedText: extractedText || "No text could be extracted. The OCR engine (Tesseract) may not be installed, or the document may not contain readable text."
              });
            } else {
              setAnalysisResult(data);
            }
            alert("Document analyzed successfully!");
          } else if (data.error === "ocr_missing") {
            setAnalysisResult({
              extractionError: true,
              extractedText: data.details || "OCR engine (Tesseract) is not installed. Please install it to analyze image/PDF documents.",
              file: files[0]?.name || "unknown"
            });
            alert("OCR not available — see results panel for details.");
          } else {
            alert("Analysis failed: " + (data.error || "Unknown error"));
          }
      } catch (error) {
        console.error("Analysis error:", error);
        alert("Something went wrong: " + error.message);
      } finally {
        setAnalyzing(false);
      }
    };

const css = `
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation-duration: 0.25s;
    animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
  }
  
  .upload-section { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; padding-bottom: 2rem; }
  .upload-card { background: rgba(255,250,240,0.9); backdrop-filter: blur(10px); border-radius: 1.5rem; padding: 2rem; max-width: 600px; width: 100%; text-align: center; box-shadow: 0 8px 30px rgba(200,180,200,0.2); border: 1px solid rgba(255,255,255,0.6); transition: all 0.3s ease; }
  .upload-card:hover { transform: translateY(-2px); box-shadow: 0 12px 35px rgba(200,180,200,0.25); }
  .drop-zone { border: 2px dashed #f0c4c4; border-radius: 1rem; padding: 2rem 1rem; background: #fff8f5; display: flex; flex-direction: column; align-items: center; gap: 0.6rem; cursor: pointer; color: #d08b8b; transition: all 0.3s ease; }
  .drop-zone:hover { background-color: #fff1ed; border-color: #f5baba; transform: scale(1.02); }
  .drop-zone input { display: none; }
  .upload-btn { background: #fcb8b8; color: #7e3a3a; padding: 0.75rem 1.5rem; border: none; border-radius: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(200,180,200,0.3); margin-top: 1rem; }
  .upload-btn:hover { background: #f7a5a5; transform: translateY(-2px); box-shadow: 0 6px 18px rgba(200,180,200,0.4); }
  .uploaded-item { background: #fff8f5; border-radius: 0.75rem; padding: 0.6rem 1rem; margin-bottom: 0.5rem; color: #8b5c5c; box-shadow: 0 2px 8px rgba(200,180,200,0.15); display: flex; justify-content: space-between; align-items: center; }
`;

  return (
    <UserWrapper>
      <div className="upload-section">
        <h1 className="text-2xl font-semibold mb-2">📤 Upload Documents</h1>
        <p className="text-gray-700 mb-3">
          Upload test reports or related documents securely.
        </p>

        <div className="upload-card">
          <div
            className="drop-zone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current.click()}
          >
            <UploadCloud size={42} color="#b35959" />
            <span>Drag & Drop files here or click to select</span>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFilesChange}
            />
          </div>

          {files.length > 0 && (
            <div className="file-names">
              {files.map((f, i) => (
                <p key={i}>📄 <b>{f.name}</b></p>
              ))}
            </div>
          )}

          {/* Category Selector */}
          <div style={{ marginTop: "1rem" }}>
            <label style={{ marginRight: "0.5rem", color: "#7e3a3a" }}>
              <Tag size={16} style={{ marginRight: "0.25rem" }} />
              Category:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                padding: "0.5rem",
                borderRadius: "0.5rem",
                border: "1px solid #f0c4c4",
                background: "#fff8f5",
              }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

<button className="upload-btn" onClick={handleUpload}>
             {uploading ? "Uploading..." : "Start Upload"}
           </button>

           <button 
             className="upload-btn" 
             onClick={handleAnalyze}
             style={{ marginLeft: "0.5rem", background: "#7b61ff" }}
           >
             {analyzing ? "Analyzing..." : "Analyze Document"}
           </button>

          {uploading && (
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          )}

{success && (
             <div className="success-msg">
               <CheckCircle2 color="#16a34a" size={20} />
               <span>Upload Successful!</span>
             </div>
           )}
         </div>

{/* ✅ Analysis Results */}
          {analysisResult && (
            <div className="upload-card" style={{ marginTop: "1rem" }}>
              <h3 className="text-lg font-semibold mb-2">📊 Analysis Results</h3>
              <div style={{ textAlign: "left", padding: "1rem" }}>
                <p><strong>File:</strong> {analysisResult.file}</p>

                {analysisResult.extractionError ? (
                  <div style={{
                    marginTop: "0.5rem",
                    padding: "0.75rem",
                    background: "#fff3f3",
                    border: "1px solid #f5baba",
                    borderRadius: "0.5rem",
                    color: "#7e3a3a"
                  }}>
                    <p><strong>⚠️ Extraction Failed</strong></p>
                    <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
                      {analysisResult.extractedText}
                    </p>
                  </div>
                ) : (
                  <>
                    <p><strong>Extracted Text Preview:</strong></p>
                    <p style={{ fontSize: "0.85rem", color: "#555", maxHeight: "100px", overflow: "auto", background: "#f9f9f9", padding: "0.5rem" }}>
                      {analysisResult.extractedText?.substring(0, 500)}...
                    </p>
                    </>
                )}
              </div>
            </div>
          )}

{/* ✅ Uploaded file list */}
        <div className="uploaded-list">
          <h3 className="text-lg font-semibold mb-2">Previously Uploaded</h3>
          {uploadedFiles.length > 0 ? (
            uploadedFiles.map((file, i) => {
              // Defensive handling for file data
              if (!file) return null;
              
              const isString = typeof file === "string";
              let fileEntry = {};
              
              if (isString) {
                fileEntry = { filePath: file, filename: file.split("/").pop(), category: "Other" };
              } else if (typeof file === "object") {
                fileEntry = { ...file };
              }
              
              const filename = fileEntry.filename || (fileEntry.filePath ? fileEntry.filePath.split("/").pop() : "unknown") || "unknown";
              const filePath = fileEntry.filePath || `/uploads/${filename}`;
              const fileCategory = fileEntry.category || "Other";

              const handleDelete = async () => {
                if (!window.confirm(`Delete ${filename}?`)) return;
                try {
                  const res = await fetch(`${API_BASE}/api/uploads/${filename}`, {
                    method: "DELETE",
                  });
                  const data = await res.json();

                  if (res.ok) {
                    setUploadedFiles((prev) => prev.filter((f) => {
                      if (!f) return true;
                      const name = typeof f === "string" ? f.split("/").pop() : (f.filename || f.filePath?.split("/").pop());
                      return name !== filename;
                    }));
                  } else {
                    alert("Delete failed: " + data.message);
                  }
                } catch {
                   alert("Error deleting file!");
                }
              };

              return (
                <div key={i} className="uploaded-item">
                  <div>
                    <a href={`${API_BASE}${filePath}`} target="_blank" rel="noopener noreferrer">
                      {filename}
                    </a>
                    <span style={{ marginLeft: "0.5rem", fontSize: "0.8rem", color: "#d08b8b" }}>
                      [{fileCategory}]
                    </span>
                  </div>
                  <button
                    onClick={handleDelete}
                    style={{
                      background: "#ffb3b3",
                      border: "none",
                      color: "#7e3a3a",
                      borderRadius: "8px",
                      padding: "4px 10px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Delete
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No files uploaded yet.</p>
          )}
        </div>
      </div>

      <style>{css}</style>
    </UserWrapper>
  );
}

export default UploadD;