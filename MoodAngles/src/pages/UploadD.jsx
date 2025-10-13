import React, { useState } from "react";
import UserWrapper from "../components/UserWrapper";

function SingleUpload() {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
  };

  const handleUpload = () => {
    if (!fileName) {
      alert("Please select a file first!");
      return;
    }
    // Mock upload, replace with actual API call
    alert(`File "${fileName}" uploaded successfully!`);
    setFileName("");
  };

  const css = `
    .upload-card {
      background: #fdf6f0;
      padding: 2rem;
      border-radius: 1.5rem;
      max-width: 500px;
      margin: 2rem auto;
      box-shadow: 0 8px 20px rgba(200,180,200,0.2);
      text-align: center;
      font-family: 'Poppins', sans-serif;
    }

    .upload-card input[type="file"] {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 8px;
      width: 100%;
      margin-top: 1rem;
      cursor: pointer;
    }

    .upload-card button {
      margin-top: 1.5rem;
      background: #f5e6f0;
      color: #6b4b6b;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .upload-card button:hover {
      background: #e8d8e8;
      transform: translateY(-2px);
    }

    .file-name {
      margin-top: 1rem;
      color: #5a4c5a;
      font-size: 0.95rem;
    }
  `;

  return (
    <UserWrapper>
      <div className="upload-card">
        <h2>📤 Upload a File</h2>
        <input type="file" onChange={handleFileChange} />
        {fileName && <p className="file-name">Selected File: <b>{fileName}</b></p>}
        <button onClick={handleUpload}>Upload</button>
      </div>
      <style>{css}</style>
    </UserWrapper>
  );
}

export default SingleUpload;
