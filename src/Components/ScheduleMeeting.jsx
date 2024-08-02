import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const ScheduleMeeting = ({ groupnumber }) => {
  const [topic, setTopic] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [message, setMessage] = useState('');
  const [meetingDetails, setMeetingDetails] = useState(null);
  const [number, setNumber] = useState(String(groupnumber));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      topic,
      start_time: startTime,
      duration: parseInt(duration),
      number: number
    };

    try {
      // const response = await fetch('http://localhost:5000/api/meetings/schedule-meeting', {
        const response = await fetch('https://fypms-back-end.vercel.app/api/meetings/schedule-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      console.log(result)
      // setMeetingDetails(result);
      toast.success('Meeting scheduled successfully!')
      setMessage('Meeting scheduled successfully!');
    } catch (error) {
      setMessage('Error: ' + error.message);
      toast.success('Error: ' + error.message)
      // setMeetingDetails(null);
    }
  };

  // const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  // const [isListening, setIsListening] = useState(false);

  // const startListening = () => {
  //   SpeechRecognition.startListening({ continuous: true });
  //   setIsListening(true);
  // };

  // const stopListening = () => {
  //   SpeechRecognition.stopListening();
  //   setIsListening(false);
  // };

  // const handleTranscript = () => {
  //   if (transcript) {
  //     toast.success('Transcript updated!');
  //   }
  // };

  // React.useEffect(() => {
  //   handleTranscript();
  // }, [transcript]);

  // if (!browserSupportsSpeechRecognition) {
  //   return <p>Your browser does not support speech recognition.</p>;
  // }

  const fetchMeetingDetails = async (id) => {
    try {
      const response = await fetch(`https://fypms-back-end.vercel.app/api/meetings/meeting-details/${id}`);
      const data = await response.json();
      console.log(data)
      setMeetingDetails(data);
    } catch (error) {
      toast.error('Error fetching meeting details: ' + error.message);
    }
  };

  useEffect(() => {
    if (groupnumber) {
      fetchMeetingDetails(groupnumber);
    }
  }, [groupnumber]);

  return (
    <div className=''>
      <h1 className='font-bold text-3xl'>Schedule a Zoom Meeting</h1>
      <form onSubmit={handleSubmit} className='mt-10 flex flex-col gap-5'>
        <label className='font-semibold text-xl'>
          Topic:
          <input type="text" className='mt-2 font-normal p-2 text-base' placeholder='Meeting Agenda' value={topic} onChange={(e) => setTopic(e.target.value)} required />
        </label>
        <label className='font-semibold text-xl'>
          Start Time:
          <input type="datetime-local" className='mt-2 font-normal p-2 text-base' value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </label>
        <label className='font-semibold text-xl'>
          Duration (minutes):
          <input type="number" className='mt-2 font-normal p-2 text-base' placeholder='Meeting Duration' value={duration} onChange={(e) => setDuration(e.target.value)} required />
        </label>
        <button type="submit" className="bg-primarycolor hover:bg-primarycolorhover p-3 text-white">Schedule Meeting</button>
      </form>
      {message && <p>{message}</p>}
      {meetingDetails && meetingDetails.meetings.length > 0 && (
        <div className='flex flex-col gap-2 mt-10'>
          <h2 className='font-bold text-3xl'>Meeting Details</h2>
          {meetingDetails.meetings.slice().reverse().map((meeting, index) => (
            <div className='flex gap-5 mt-5'>
              <p>{++index}</p>

              <div key={index} className='flex flex-col gap-2'>
                <p><strong>Topic:</strong> {meeting.topic}</p>
                <p><strong>Start Time:</strong> {new Date(meeting.start_time).toLocaleString()}</p>
                <p><strong>Duration:</strong> {meeting.duration} minutes</p>
                <p><strong>Join URL:</strong> <a href={meeting.join_url} target="_blank" rel="noopener noreferrer">{meeting.join_url}</a></p>
              </div>
            </div>

          ))}
        </div>
      )}
      {/* <div className="p-4">
        <h1 className="font-bold text-3xl">Real-Time Speech Recognition</h1>
        <div className="mt-4">
          <button
            onClick={startListening}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
          >
            Start Listening
          </button>
          <button
            onClick={stopListening}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded ml-2"
          >
            Stop Listening
          </button>
          <button
            onClick={resetTranscript}
            className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded ml-2"
          >
            Reset
          </button>
        </div>
        <div className="mt-4">
          <h2 className="font-bold text-2xl">Transcript:</h2>
          <p className="border p-2 mt-2">{transcript}</p>
        </div>
      </div> */}
      <Toaster />
    </div>
  );
};

export default ScheduleMeeting;
