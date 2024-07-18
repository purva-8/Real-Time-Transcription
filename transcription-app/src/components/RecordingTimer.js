// src/components/RecordingTimer.js
import React, { useEffect } from 'react';

function RecordingTimer({ isRecording, seconds, setSeconds }) {
  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setSeconds(0); // Reset seconds when stopped
    }
    return () => clearInterval(interval);
  }, [isRecording, setSeconds]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div>
      <p>Recording Time: {formatTime(seconds)}</p>
    </div>
  );
}

export default RecordingTimer;
