import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, Paper } from '@mui/material';

function ConversationHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await fetch('http://localhost:5000/conversation_history');
      const data = await response.json();
      setHistory(data);
    };

    fetchHistory();
  }, []);

  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Conversation History
      </Typography>
      <List>
        {history.map((item) => (
          <ListItem key={item.id}>
            <Paper
              elevation={2}
              sx={{
                padding: 2,
                backgroundColor: item.speaker === 'A' ? '#e0e0e0' : '#b0b0b0',
                color: '#000000',
              }}
            >
              <ListItemText
                primary={`${item.timestamp}: ${item.content}`}
                primaryTypographyProps={{ style: { color: '#000000' } }}
              />
            </Paper>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default ConversationHistory;
