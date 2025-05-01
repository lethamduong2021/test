import React from 'react';
import FileUpload from './components/FileUpload';
import { CssBaseline, Container } from '@mui/material';

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Container>
        <FileUpload />
      </Container>
    </div>
  );
}

export default App;
