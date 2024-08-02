import React, { useState, useRef } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AudioRecorder = ({ meetingAgenda, number }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [summary, setSummary] = useState('');
    const mediaRecorderRef = useRef(null);

    const handleButtonClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const startRecording = () => {
        console.log("started")
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorderRef.current = new MediaRecorder(stream);
                mediaRecorderRef.current.ondataavailable = event => {
                    if (event.data.size > 0) {
                        uploadAudio(event.data);
                    }
                };
                mediaRecorderRef.current.start();
                setIsRecording(true);
            })
            .catch(error => {
                console.error('Error accessing microphone', error);
            });
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const uploadAudio = async (audioBlob) => {
        console.log("sended")

        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');
        formData.append('meetingAgenda', meetingAgenda);
        formData.append('number', number);

        try {
            // const response = await axios.post('http://localhost:5000/api/zeogoCloudMeeting/upload', formData, {
            const response = await axios.post('https://fypms-back-end.vercel.app/api/zeogoCloudMeeting/upload', formData, {

                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Summary Saved');
            setTranscription(response.data.transcription);
            setSummary(response.data.summary);
        } catch (error) {
            console.error('Error uploading file', error);
            toast.error('Error uploading file', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-start px-5 bg-white">
            <button
                onClick={handleButtonClick}
                className={`${isRecording ? 'bg-red-500 hover:bg-red-400' : 'bg-blue-500 hover:bg-blue-400'} text-white  duration-100 ease-out font-bold rounded-full py-2 px-4 mt-4`}
            >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            {transcription && (

                <div className="mt-4 bg-white text-black p-4 rounded shadow-lg">
                    <h2 className="text-xl font-bold mb-2">Transcription</h2>

                    <p>{transcription}</p>

                </div>
            )}
            {summary && (

                <div className="mt-4 bg-white text-black p-4 rounded shadow-lg">
                    <h2 className="text-xl font-bold mb-2">Summary</h2>

                    <ul>
                        {summary.split('\n').map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>

                </div>
            )}

            <Toaster />

        </div>
    );
};

export default AudioRecorder;
