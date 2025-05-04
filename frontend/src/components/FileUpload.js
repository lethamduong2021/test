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

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [responseContent, setResponseContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
    </Box>
  );
};

export default FileUpload;
