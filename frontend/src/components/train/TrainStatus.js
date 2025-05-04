import React from 'react';
import { Alert } from '@mui/material';

const TrainStatus = ({ status }) => {
  if (!status) return null;
  return (
    <Alert
      severity={
        status.startsWith('Lỗi') || status.startsWith('Đã dừng train')
          ? "error"
          : status.startsWith('Quá trình train đã thực hiện xong')
          ? "success"
          : "info"
      }
      sx={{
        marginTop: 2,
        backgroundColor:
          status.startsWith('Đã dừng train')
            ? '#ffebee'
            : status.startsWith('Quá trình train đã thực hiện xong')
            ? '#d0f5e8'
            : undefined,
        color:
          status.startsWith('Đã dừng train')
            ? '#d32f2f'
            : status.startsWith('Quá trình train đã thực hiện xong')
            ? '#388e3c'
            : undefined,
        fontWeight: 'bold',
        fontSize: 18,
      }}
    >
      {status}
    </Alert>
  );
};

export default TrainStatus;
