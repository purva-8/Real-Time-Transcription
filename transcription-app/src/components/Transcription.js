// src/components/Transcription.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Button, Typography, Box, List, ListItem, ListItemText, Paper } from '@mui/material';
import RecordingTimer from './RecordingTimer';

const socket = io('http://localhost:5000');

function Transcription() {
  const [transcriptions, setTranscriptions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0); // Add seconds state

  useEffect(() => {
    socket.on('transcription', (data) => {
      setTranscriptions((prevTranscriptions) => [...prevTranscriptions, data]);
    });

    return () => {
      socket.off('transcription');
    };
  }, []);

  const startTranscription = async () => {
    setIsRecording(true);
    setSeconds(0); // Reset timer on start
    await fetch('http://localhost:5000/start_transcription', { method: 'POST' });
  };

  const stopTranscription = async () => {
    setIsRecording(false);
    setSeconds(0); // Reset timer on stop
    await fetch('http://localhost:5000/stop_transcription', { method: 'POST' });
  };

  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Real-time Transcription
      </Typography>
      <Button variant="contained" color="primary" onClick={startTranscription} sx={{ margin: 1 }}>
        Start
      </Button>
      <Button variant="contained" color="secondary" onClick={stopTranscription} sx={{ margin: 1 }}>
        Stop
      </Button>
      <RecordingTimer isRecording={isRecording} seconds={seconds} setSeconds={setSeconds} />
      <List sx={{ marginTop: 2 }}>
        {transcriptions.map((item, index) => (
          <ListItem key={index}>
            <Paper
              elevation={2}
              sx={{
                padding: 2,
                backgroundColor: item.speaker === 'AI' ? '#e0e0e0' : '#ffffff',
                color: item.speaker === 'AI' ? '#000000' : '#0000ff', // Adjust color based on speaker
              }}
            >
              <ListItemText
                primary={`${item.timestamp}: ${item.content}`}
                primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
              />
            </Paper>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Transcription;
