import React from 'react';
import { Container, Grid, Box, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';
import Header from '../components/layout/Header';
import FileUpload from '../components/fileUpload';
import TrainStatus from '../components/train';

const HomePage = () => (
  <>
    <Helmet>
      <title>Nền tảng AI - Tải lên & Huấn luyện mô hình</title>
      <meta name="description" content="Nền tảng AI giúp bạn tải lên dữ liệu và huấn luyện mô hình AI dễ dàng, nhanh chóng." />
    </Helmet>
    <Header />
    <main>
      <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FileUpload />
          </Grid>
          <Grid item xs={12} md={6}>
            <TrainStatus />
          </Grid>
        </Grid>
      </Container>
    </main>
    <footer>
      <Box sx={{ textAlign: 'center', py: 2, color: '#888' }}>
        © {new Date().getFullYear()} Nền tảng AI. Liên hệ: <a href="mailto:contact@yourdomain.com">contact@yourdomain.com</a>
      </Box>
    </footer>
  </>
);

export default HomePage;

