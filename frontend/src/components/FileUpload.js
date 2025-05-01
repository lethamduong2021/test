import React, { useState } from 'react';
import { uploadFile } from '../services/fileUploadService';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [responseContent, setResponseContent] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    try {
      const response = await uploadFile(selectedFile);
      setResponseContent(response.content); // Hiển thị nội dung file từ backend
      setError('');
    } catch (err) {
      setError(err.message);
      setResponseContent('');
    }
  };

  return (
    <div className="container">
      <h1>Upload File</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit">Upload</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {responseContent && (
        <div>
          <h2>File Content:</h2>
          <pre>{responseContent}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUpload;