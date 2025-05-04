import React from 'react';
import { Button, TextField } from '@mui/material';

const FileUploadForm = ({ onFileChange, onSubmit, loading, disabled }) => (
  <form onSubmit={onSubmit}>
    <TextField
      type="file"
      fullWidth
      onChange={onFileChange}
      inputProps={{ accept: '*' }}
      sx={{ marginBottom: 2 }}
      disabled={disabled}
      label="Chọn tệp"
      InputLabelProps={{ shrink: true }}
    />
    <Button
      type="submit"
      variant="contained"
      color="primary"
      fullWidth
      disabled={loading || disabled}
    >
      {loading ? 'Đang tải lên...' : 'Tải lên'}
    </Button>
  </form>
);

export default FileUploadForm;
