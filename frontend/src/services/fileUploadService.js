import axios from 'axios';

const API_URL = 'http://localhost:8000/v1/upload'; // URL của backend FastAPI

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Trả về dữ liệu từ backend
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Error uploading file');
  }
};