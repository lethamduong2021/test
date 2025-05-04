import React, { useState } from 'react';
import { uploadFile } from '../services/fileUploadService';
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from 'axios';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [responseContent, setResponseContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [trainStatus, setTrainStatus] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError('');
    setResponseContent('');

    try {
      const response = await uploadFile(selectedFile);
      setResponseContent(response.content); // Hiển thị nội dung trả về từ backend
      setUploadedFilename(response.filename);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTrain = async () => {
    setTrainStatus('Đang train...');
    try {
      const res = await axios.post('http://localhost:8000/v1/train', { filename: uploadedFilename });
      if (res.data.error) {
        setTrainStatus('Lỗi: ' + res.data.error);
      } else {
        setTrainStatus('Quá trình train đã thực hiện xong');
      }
    } catch (err) {
      setTrainStatus('Có lỗi khi train!');
    }
  };

  return (
    <Box
      sx={{
        margin: 'auto',
        padding: 4,
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Upload File
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          type="file"
          fullWidth
          onChange={handleFileChange}
          inputProps={{ accept: '*' }}
          sx={{ marginBottom: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </form>
      {error && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          {error}
        </Alert>
      )}
      {responseContent && (
        <Box sx={{ marginTop: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
            <Typography variant="h6" sx={{ marginRight: 1 }}>
              File Content:
            </Typography>
            <IconButton
              aria-label="Copy file content"
              onClick={() => {
                if (responseContent) {
                  navigator.clipboard.writeText(responseContent);
                }
              }}
              size="small"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box
            component="pre"
            sx={{
              backgroundColor: '#f4f4f4',
              padding: 2,
              borderRadius: 1,
              overflowX: 'auto',
              overflowY: 'auto',        // Hiển thị thanh cuộn dọc
              maxWidth: '100%',
              height: 300,           // Chiều cao tối đa trước khi cuộn
              whiteSpace: 'pre-wrap',   // Xuống dòng nếu dài
              fontFamily: 'monospace',
              fontSize: 16,
            }}
          >
            {responseContent}
          </Box>
        </Box>
      )}
      {uploadedFilename && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleTrain}
          sx={{ marginTop: 2 }}
        >
          Train
        </Button>
      )}
      {trainStatus && (
        <Alert severity="info" sx={{ marginTop: 2 }}>
          {trainStatus}
        </Alert>
      )}
    </Box>
  );
};

export default FileUpload;
