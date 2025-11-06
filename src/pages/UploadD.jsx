import React, { useState, useRef, useEffect } from "react";
import UserWrapper from "../components/UserWrapper";
import { UploadCloud, FileUp, CheckCircle2 } from "lucide-react";

function UploadD() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // ✅ Fetch already uploaded files
  useEffect(() => {
    fetch("http://localhost:5000/api/uploads")
      .then((res) => res.json())
      .then((data) => setUploadedFiles(data))
      .catch((err) => console.error("Error fetching uploaded files:", err));
  }, []);

  // Handle file selection or drop
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

  // ✅ Upload to backend
  const handleUpload = async () => {
    if (!files.length) return alert("Please select a file!");

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", files[0]); // uploading one at a time

      const res = await fetch("http://localhost:5000/api/upload", {
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
    .upload-section {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      padding-bottom: 2rem;
    }

    .upload-card {
      background: rgba(255, 250, 240, 0.9);
      backdrop-filter: blur(10px);
      border-radius: 1.5rem;
      padding: 2rem;
      max-width: 600px;
      width: 100%;
      text-align: center;
      box-shadow: 0 8px 30px rgba(200, 180, 200, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.6);
      transition: all 0.3s ease;
    }

    .upload-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(200, 180, 200, 0.25);
    }

    .drop-zone {
      border: 2px dashed #f0c4c4;
      border-radius: 1rem;
      padding: 2rem 1rem;
      background: #fff8f5;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.6rem;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #d08b8b;
    }

    .drop-zone:hover {
      background-color: #fff1ed;
      border-color: #f5baba;
      transform: scale(1.02);
    }

    .drop-zone input {
      display: none;
    }

    .divider {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #f7c8c8;
      font-weight: 600;
      margin: 1rem 0;
      position: relative;
    }

    .divider::before, .divider::after {
      content: "";
      height: 1px;
      background: #ffe4e1;
      width: 35%;
      margin: 0 10px;
    }

    .file-btn {
      background: linear-gradient(90deg, #ffe4e1, #ffd3d1);
      color: #8b5c5c;
      padding: 0.7rem 1.6rem;
      border: none;
      border-radius: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(200, 180, 200, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin: 0 auto 1rem;
    }

    .file-btn:hover {
      background: linear-gradient(90deg, #ffd3d1, #ffc0be);
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(200, 180, 200, 0.35);
    }

    .file-names {
      margin-top: 1rem;
      text-align: left;
      max-height: 150px;
      overflow-y: auto;
    }

    .file-names p {
      font-size: 0.95rem;
      color: #b35959;
      word-break: break-word;
      margin-bottom: 0.3rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .upload-btn {
      background: #fcb8b8;
      color: #7e3a3a;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(200, 180, 200, 0.3);
      margin-top: 1rem;
    }

    .upload-btn:hover {
      background: #f7a5a5;
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(200, 180, 200, 0.4);
    }

    .progress-bar {
      margin-top: 1rem;
      height: 8px;
      width: 100%;
      background: #ffe6e6;
      border-radius: 5px;
      overflow: hidden;
      position: relative;
    }

    .progress-fill {
      position: absolute;
      height: 100%;
      background: linear-gradient(90deg, #ffcdc9, #ffc1bd);
      width: 100%;
      animation: progress 2.5s linear forwards;
    }

    @keyframes progress {
      from { width: 0%; }
      to { width: 100%; }
    }

    .success-msg {
      margin-top: 1rem;
      color: #16a34a;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      animation: fadeIn 0.5s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .uploaded-list {
      margin-top: 2rem;
      width: 100%;
      max-width: 600px;
      text-align: left;
    }

    .uploaded-item {
      background: #fff8f5;
      border-radius: 0.75rem;
      padding: 0.6rem 1rem;
      margin-bottom: 0.5rem;
      color: #8b5c5c;
      box-shadow: 0 2px 8px rgba(200, 180, 200, 0.15);
    }

    .uploaded-item a {
      color: #b35959;
      text-decoration: none;
      font-weight: 600;
    }

    .uploaded-item a:hover {
      text-decoration: underline;
    }
  `;

  return (
    <UserWrapper>
      <div className="upload-section">
        <h1 className="text-2xl font-semibold mb-2">📤 Upload Documents</h1>
        <p className="text-gray-700 mb-3">
          Upload test reports or related documents securely to your account.
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

          <div className="divider">OR</div>

          <button
            className="file-btn"
            onClick={() => fileInputRef.current.click()}
          >
            <FileUp size={20} /> Choose Files
          </button>

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
    <div key={i} className="uploaded-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
          fontWeight: "600"
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
