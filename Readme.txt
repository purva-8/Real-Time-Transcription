Real-Time Transcription System using Flask

Backend Setup

1. Set Up PostgreSQL Database:

- Install PostgreSQL (if not already installed).
- Create a new database named conversation_db.
- Create a database user conversation_user with the password.
- Update conn_params in app.py with your PostgreSQL database credentials.

2. Start Backend Server:

	python app.py

- The backend server will start at http://localhost:5000.

Frontend Setup

Step 1: Setting Up the React Application

1. Install Node.js and npm
2. Create a New React Application
	
	npx create-react-app transcription-app

3. Install Additional Dependencies

	npm install socket.io-client

4. Install Material-UI

	npm install @mui/material @emotion/react @emotion/styled

5. Start the React Development Server

	npm start

- The frontend development server will start at http://localhost:3000.


Step 2: Create Components

1. Create a new directory for components
2. Create Transcription.js file
3. Create ConversationHistory.js file
4. Update App.js file
5. Update App.css file:
6. Create a theme.js file
7. Update index.js file
8. Create RecordingTimer.js file


List of Dependencies

Backend Dependencies

- Flask
- Flask-SocketIO
- Flask-CORS
- PyAudio
- SpeechRecognition
- psycopg2-binary
- pyannote.audio
- SpeechBrain
- SpellChecker

Frontend Dependencies

- React
- Material-UI
- Socket.IO-client


Approach for Real-Time Processing and Speaker Diarization

Real-Time Processing:

-The system captures audio input using PyAudio, which records audio in chunks. These chunks are streamed to the backend server, where SpeechRecognition processes them to transcribe speech into text. Transcription results are emitted in real-time to the frontend via WebSocket (Socket.IO).

Speaker Diarization:

- Speaker diarization is performed using pyannote.audio, which segments audio into speaker turns based on machine learning models trained for speaker identification. Each segment is associated with a speaker label, allowing the system to differentiate between speakers during transcription. Speaker labels are stored alongside transcription data in the PostgreSQL database.

Assumptions or Limitations of Implementation

- Speaker Overlap: The system assumes non-overlapping speech segments for accurate speaker diarization. Overlapping speech may lead to incorrect speaker labels.

- Performance: Real-time processing performance may vary based on hardware capabilities, network conditions, and the complexity of audio input.

- Dependency Management: Dependency versions and compatibility may affect system stability and performance.

