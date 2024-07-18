from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import threading
import pyaudio
import wave
import speech_recognition as sr
from pyannote.audio import Pipeline
import psycopg2
from datetime import datetime
from spellchecker import SpellChecker

# PostgreSQL connection parameters
conn_params = {
    'dbname': 'conversation_db',
    'user': 'conversation_user',
    'password': 'dgaba2912',
    'host': 'localhost',
    'port': '5432'
}

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

is_recording = False
hf_token = "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"  # Replace with your actual Hugging Face token

def save_to_database(conversation_text, speaker, timestamp):
    sql = """INSERT INTO conversations (content, speaker, timestamp)
             VALUES (%s, %s, %s);"""
    data = (conversation_text, speaker, timestamp)

    try:
        conn = psycopg2.connect(**conn_params)
        cur = conn.cursor()
        cur.execute(sql, data)
        conn.commit()
        print("Conversation saved to PostgreSQL successfully!")
    except (Exception, psycopg2.Error) as error:
        print("Error while saving conversation to PostgreSQL:", error)
    finally:
        if conn:
            cur.close()
            conn.close()

def capture_audio(output_file, record_seconds=10):
    chunk = 1024  # Record in chunks of 1024 samples
    sample_format = pyaudio.paInt16  # 16 bits per sample
    channels = 1
    fs = 44100  # Record at 44100 samples per second

    p = pyaudio.PyAudio()

    print('Recording')

    stream = p.open(format=sample_format,
                    channels=channels,
                    rate=fs,
                    frames_per_buffer=chunk,
                    input=True)

    frames = []

    for _ in range(0, int(fs / chunk * record_seconds)):
        data = stream.read(chunk)
        frames.append(data)

    print('Finished recording')

    stream.stop_stream()
    stream.close()
    p.terminate()

    wf = wave.open(output_file, 'wb')
    wf.setnchannels(channels)
    wf.setsampwidth(p.get_sample_size(sample_format))
    wf.setframerate(fs)
    wf.writeframes(b''.join(frames))
    wf.close()

# Initialize the spell checker
spell = SpellChecker()

def transcribe_audio(audio_file):
    recognizer = sr.Recognizer()
    audio_file = sr.AudioFile(audio_file)

    with audio_file as source:
        audio = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio)
        print('Transcription (Raw): ' + text)
        
        # Error correction
        corrected_text = correct_errors(text)
        print('Transcription (Corrected): ' + corrected_text)
        
        return corrected_text
    except sr.UnknownValueError:
        print('Google Speech Recognition could not understand audio')
        return ""
    except sr.RequestError as e:
        print('Could not request results from Google Speech Recognition service; {0}'.format(e))
        return ""

def correct_errors(text):
    corrected_words = []
    words = text.split()
    for word in words:
        corrected_word = spell.correction(word)
        corrected_words.append(corrected_word)
    return " ".join(corrected_words)

def diarize_audio(audio_file, hf_token):
    pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization", use_auth_token=hf_token)

    diarization = pipeline(audio_file)

    diarized_segments = []
    for turn, _, speaker in diarization.itertracks(yield_label=True):
        segment = {
            "speaker": speaker,
            "start": turn.start,
            "end": turn.end
        }
        diarized_segments.append(segment)
        print(f"Speaker {speaker}: {turn.start:.1f}s -> {turn.end:.1f}s")

    return diarized_segments

@app.route('/start_transcription', methods=['POST'])
def start_transcription():
    global is_recording
    is_recording = True
    thread = threading.Thread(target=record_and_transcribe)
    thread.start()
    return jsonify({"message": "Transcription started"}), 200

@app.route('/stop_transcription', methods=['POST'])
def stop_transcription():
    global is_recording
    is_recording = False
    return jsonify({"message": "Transcription stopped"}), 200

@app.route('/conversation_history', methods=['GET'])
def conversation_history():
    try:
        conn = psycopg2.connect(**conn_params)
        cur = conn.cursor()
        cur.execute("SELECT * FROM conversations ORDER BY timestamp DESC;")
        rows = cur.fetchall()
        history = [{"id": row[0], "content": row[1], "speaker": row[2], "timestamp": row[3].isoformat()} for row in rows]
        return jsonify(history), 200
    except (Exception, psycopg2.Error) as error:
        print("Error while retrieving conversation history from PostgreSQL:", error)
        return jsonify({"error": str(error)}), 500
    finally:
        if conn:
            cur.close()
            conn.close()

def record_and_transcribe():
    audio_file = "output.wav"
    while is_recording:
        capture_audio(audio_file, record_seconds=10)
        transcription = transcribe_audio(audio_file)
        diarized_segments = diarize_audio(audio_file, hf_token)
        for segment in diarized_segments:
            content = f"Speaker {segment['speaker']}: {transcription}"
            timestamp = datetime.now()
            save_to_database(content, segment['speaker'], timestamp)
            socketio.emit('transcription', {"content": content, "speaker": segment['speaker'], "timestamp": timestamp.isoformat()})

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5000)
