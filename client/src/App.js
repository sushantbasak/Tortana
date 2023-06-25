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

  const sendAudioFileToServer = (file) => {
    const formData = new FormData();

    formData.append('audio-file', file);
    return fetch('http://localhost:6222/profile', {
      method: 'POST',
      body: formData,
    });
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    stopTimer();

    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    sendAudioFileToServer(audioBlob);
    setAudioChunks([]);
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
    </div>
  );
};

export default AudioRecorder;
