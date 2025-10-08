import React, { useState } from "react";
import UserWrapper from "../components/UserWrapper";

function UploadD() {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
  };

  return (
    <UserWrapper>
      <h1 className="text-2xl font-semibold mb-4">📤 Upload Documents</h1>
      <p className="text-gray-700 mb-3">
        Upload test reports or related documents securely to your account.
      </p>

      <div className="bg-white p-6 rounded-xl shadow-md max-w-lg">
        <label className="block mb-2 font-medium">Choose File</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full"
        />
        {fileName && (
          <p className="mt-3 text-sm text-gray-600">
            Selected File: <b>{fileName}</b>
          </p>
        )}
        <button
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          onClick={() => alert("File uploaded successfully (mock)")}
        >
          Upload
        </button>
      </div>
    </UserWrapper>
  );
}

export default UploadD;
