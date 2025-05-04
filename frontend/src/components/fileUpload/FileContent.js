import React from 'react';
import { Box, Typography } from '@mui/material';

const FileContent = ({ content }) => (
  <Box sx={{ marginTop: 2 }}>
    <Typography variant="h6">Nội dung tệp:</Typography>
    <Box
      component="pre"
      sx={{
        backgroundColor: '#f4f4f4',
        padding: 2,
        borderRadius: 1,
        overflowX: 'auto',
        maxWidth: '100%',
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace',
        fontSize: 16,
      }}
    >
      {content}
    </Box>
  </Box>
);

export default FileContent;
