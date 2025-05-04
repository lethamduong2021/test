import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const FileContent = ({ content, onCopy }) => (
  <Box sx={{ marginTop: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Typography variant="h6" sx={{ mr: 1 }}>
        Nội dung tệp:
      </Typography>
      <IconButton
        aria-label="Sao chép nội dung tệp"
        onClick={onCopy}
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
        overflow: 'auto',
        maxHeight: { xs: 200, sm: 300, md: 400 },
        minHeight: 80,
        maxWidth: '100%',
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace',
        fontSize: 16,
        boxSizing: 'border-box',
        margin: 0,
      }}
    >
      {content}
    </Box>
  </Box>
);

export default FileContent;
