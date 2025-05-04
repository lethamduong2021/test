import { configureStore } from '@reduxjs/toolkit';
import fileReducer from './slices/fileSlice';

const store = configureStore({
  reducer: {
    file: fileReducer,
  },
});

export default store;
