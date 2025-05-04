import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedFile: null,
  responseContent: '',
  uploadedFilename: '',
  error: '',
  loading: false,
  trainStatus: '',
  isTraining: false,
};

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setSelectedFile: (state, action) => { state.selectedFile = action.payload; },
    setResponseContent: (state, action) => { state.responseContent = action.payload; },
    setUploadedFilename: (state, action) => { state.uploadedFilename = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setTrainStatus: (state, action) => { state.trainStatus = action.payload; },
    setIsTraining: (state, action) => { state.isTraining = action.payload; },
    reset: () => initialState,
  },
});

export const {
  setSelectedFile, setResponseContent, setUploadedFilename, setError,
  setLoading, setTrainStatus, setIsTraining, reset
} = fileSlice.actions;

export default fileSlice.reducer;
