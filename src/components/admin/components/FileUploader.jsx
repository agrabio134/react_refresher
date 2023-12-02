// FileUploader.jsx
import React, { useRef } from "react";

const FileUploader = ({ onFileSelectSuccess, onFileSelectError }) => {
  const fileInput = useRef(null);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelectSuccess(file);
    } else {
      onFileSelectError({ error: "No file selected" });
    }
  };

  return (
    <div className="file-uploader">
      <input
        type="file"
        onChange={handleFileInput}
        ref={fileInput}
        accept="image/*"
      />
    </div>
  );
};

export default FileUploader;
