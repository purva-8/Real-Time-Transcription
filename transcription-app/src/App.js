import React from 'react';
import Transcription from './components/Transcription';
import ConversationHistory from './components/ConversationHistory';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import './App.css';

function App() {
  return (
    <div className="App">
      <AppBar position="static" sx={{ backgroundColor: '#000000' }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Real-time Transcription System
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ marginTop: 4 }}>
          <Transcription />
          <ConversationHistory />
        </Box>
      </Container>
    </div>
  );
}

export default App;
