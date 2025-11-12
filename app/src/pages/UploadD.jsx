import React, { useState, useRef, useEffect } from "react";
import UserWrapper from "../components/UserWrapper";
import { UploadCloud, FileUp, CheckCircle2 } from "lucide-react";

function UploadD() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // ✅ Fetch uploaded files
  useEffect(() => {
    fetch("http://localhost:5000/api/uploads")
      .then((res) => res.json())
      .then((data) => setUploadedFiles(data))
      .catch((err) => console.error("Error fetching uploaded files:", err));
  }, []);

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

  // ✅ Upload
  const handleUpload = async () => {
    if (!files.length) return alert("Please select a file!");

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]); // one at a time

      const res = await fetch("http://localhost:5000/api/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setFiles([]);
        setUploadedFiles((prev) => [...prev, data.filePath]);
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

  const css = `
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

          <button className="upload-btn" onClick={handleUpload}>
            {uploading ? "Uploading..." : "Start Upload"}
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

        {/* ✅ Uploaded file list */}
        <div className="uploaded-list">
          <h3 className="text-lg font-semibold mb-2">Previously Uploaded</h3>
          {uploadedFiles.length > 0 ? (
            uploadedFiles.map((file, i) => {
              const filename = file.split("/").pop();

              const handleDelete = async () => {
                if (!window.confirm(`Delete ${filename}?`)) return;
                try {
                  const res = await fetch(`http://localhost:5000/api/uploads/${filename}`, {
                    method: "DELETE",
                  });
                  const data = await res.json();

                  if (res.ok) {
                    setUploadedFiles((prev) => prev.filter((f) => f !== file));
                  } else {
                    alert("Delete failed: " + data.message);
                  }
                } catch (err) {
                  alert("Error deleting file!");
                }
              };

              return (
                <div key={i} className="uploaded-item">
                  <a href={`http://localhost:5000${file}`} target="_blank" rel="noopener noreferrer">
                    {filename}
                  </a>
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