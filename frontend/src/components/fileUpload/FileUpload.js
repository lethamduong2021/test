import React, { useState } from 'react';
import { Box, Typography, Alert, Container } from '@mui/material';
import FileUploadForm from './FileUploadForm';
import FileContent from './FileContent';
import TrainButton from './TrainButton';
import TrainStatus from '../train/TrainStatus';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSelectedFile, setResponseContent, setUploadedFilename, setError,
  setLoading, setTrainStatus, setIsTraining
} from '../../store/slices/fileSlice';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const FileUpload = () => {
  const dispatch = useDispatch();
  const {
    selectedFile, responseContent, uploadedFilename, error, loading, trainStatus, isTraining
  } = useSelector(state => state.file);

  const [confirmStop, setConfirmStop] = useState(false);

  const handleFileChange = (event) => {
    dispatch(setSelectedFile(event.target.files[0]));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      dispatch(setError('Please select a file to upload.'));
      return;
    }
    dispatch(setLoading(true));
    dispatch(setError(''));
    dispatch(setResponseContent(''));
    try {
      const response = await axios.post(
        'http://localhost:8000/v1/upload',
        (() => {
          const formData = new FormData();
          formData.append('file', selectedFile);
          return formData;
        })(),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      dispatch(setResponseContent(response.data.content));
      dispatch(setUploadedFilename(response.data.filename));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleTrain = async () => {
    dispatch(setTrainStatus('Đang train...'));
    dispatch(setIsTraining(true));
    try {
      await axios.post('http://localhost:8000/v1/train', { filename: uploadedFilename });
      dispatch(setTrainStatus('Quá trình train đã thực hiện xong'));
    } catch (err) {
      dispatch(setTrainStatus('Có lỗi khi train!'));
    } finally {
      dispatch(setIsTraining(false));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          padding: { xs: 2, sm: 4 },
          border: '1px solid #ccc',
          borderRadius: 2,
          boxShadow: 3,
          marginTop: { xs: 2, sm: 4 },
        }}
      >
        <Typography variant="h4" gutterBottom>
          Tải lên tệp
        </Typography>
        <FileUploadForm
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
          loading={loading}
          disabled={!!uploadedFilename || isTraining}
        />
        {error && (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            {error}
          </Alert>
        )}
        {responseContent && <FileContent content={responseContent} />}
        {uploadedFilename && (
          <TrainButton
            onClick={() => {
              if (isTraining) {
                setConfirmStop(true);
              } else {
                handleTrain();
              }
            }}
          >
            {isTraining ? 'Dừng train' : 'Train'}
          </TrainButton>
        )}
        <TrainStatus status={trainStatus} />
        <Dialog open={confirmStop} onClose={() => setConfirmStop(false)}>
          <DialogTitle>Bạn có muốn dừng huấn luyện không?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setConfirmStop(false)} color="primary">
              Không
            </Button>
            <Button
              onClick={async () => {
                setConfirmStop(false);
                await axios.post('http://localhost:8000/v1/train/stop', { filename: uploadedFilename });
                dispatch(setTrainStatus('Đã dừng train!'));
                dispatch(setIsTraining(false));
              }}
              color="error"
              autoFocus
            >
              Đồng ý
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default FileUpload;
