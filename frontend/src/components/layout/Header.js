import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header = () => (
  <AppBar position="static" color="default" elevation={1}>
    <Toolbar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Nền tảng AI - Tải lên & Huấn luyện mô hình
        </Typography>
        <Typography variant="subtitle2" component="p" sx={{ color: '#555' }}>
          Ứng dụng giúp bạn tải lên dữ liệu và huấn luyện mô hình AI dễ dàng, nhanh chóng.
        </Typography>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Header;
