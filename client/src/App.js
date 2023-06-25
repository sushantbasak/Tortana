import React, { useState, useRef, useEffect } from 'react';
import './AudioRecorder.css';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [timer, setTimer] = useState(0);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.addEventListener('dataavailable', handleDataAvailable);
        mediaRecorder.start();
        setIsRecording(true);
        mediaRecorderRef.current = mediaRecorder;
        startTimer();
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    stopTimer();
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setAudioChunks((prevChunks) => [...prevChunks, event.data]);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setTimer(0);
  };

  const handleSaveAudio = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    const url = URL.createObjectURL(audioBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'recorded_audio.webm';
    link.click();
    URL.revokeObjectURL(url);
    setAudioChunks([]);
  };

  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, []);

  return (
    <div className="audio-recorder">
      <div className="audio-controls">
        {isRecording ? (
          <button className="btn-stop" onClick={stopRecording}>
            Stop Recording
          </button>
        ) : (
          <button className="btn-start" onClick={startRecording}>
            Start Recording
          </button>
        )}
      </div>
      {isRecording && <div className="timer">Recording: {timer} seconds</div>}
      {audioChunks.length > 0 && (
        <button className="btn-save" onClick={handleSaveAudio}>
          Save Audio
        </button>
      )}
    </div>
  );
};

export default AudioRecorder;
