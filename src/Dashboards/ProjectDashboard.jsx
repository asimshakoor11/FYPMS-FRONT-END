import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "./Styles/CommitteDashboard.css";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ScheduleMeeting from "../Components/ScheduleMeeting";
import Room from "../Components/Room";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);



function ProjectDashboard() {

  const [selectedComponent, setSelectedComponent] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const location = useLocation();
  const { groupId } = useParams();
  const [role, setRole] = useState('');
  const [group, setGroup] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minDate, setMinDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [overallAttendance, setOverallAttendance] = useState([]);
  const [detailedRecords, setDetailedRecords] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState('proposalDefense');

  const [RoomCode, setRoomCode] = useState("");
  const [isRoomCodeVis, setIsRoomCodeVis] = useState(true);
  const [FinalRoomCode, setFinalRoomCode] = useState("");
  const [meetingAgenda, setMeetingAgenda] = useState("");

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/')
    }
  })

  const fetchGroupByNumber = async () => {
    try {
      // const response = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
      const response = await axios.get(`https://fypms-back-end.vercel.app/api/groups/${groupId}`);

      if (response.data && response.data.members) {
        setGroup(response.data);
        setRoomCode(`Group${response.data.number}`); // Generate the room code
        setAttendance(response.data.members.map(member => ({
          studentId: member._id,
          present: false,
        })));
      } else {
        toast.error('No members data available');
      }
      setLoading(false);
    } catch (err) {
      setGroup([]);
      setLoading(false);
      if (err.response && err.response.status === 404) {
        toast.error('Group not found');
      } else {
        toast.error('An error occurred while fetching the group');
      }
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchGroupByNumber();
    }
  }, [groupId]);

  const [meetingsData, setMeetingsData] = useState(null);

  const fetchMeetingsData = async () => {
    try {
      // const response = await axios.get(`http://localhost:5000/api/zeogoCloudMeeting/data/${groupId}`);
      const response = await axios.get(`https://fypms-back-end.vercel.app/api/zeogoCloudMeeting/data/${groupId}`);
      setMeetingsData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetingsData();
  }, [groupId, selectedComponent]);


  const [meetingDetails, setMeetingDetails] = useState(null);

  const fetchMeetingDetails = async (id) => {
    try {
      // const response = await fetch(`http://localhost:5000/api/meetings/meeting-details/${id}`);
      const response = await fetch(`https://fypms-back-end.vercel.app/api/meetings/meeting-details/${id}`);
      const data = await response.json();
      console.log(data)
      setMeetingDetails(data);
    } catch (error) {
      toast.error('Error fetching meeting details: ' + error.message);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchMeetingDetails(groupId);
    }
  }, [groupId]);


  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);



  const [showTaskHistory, setShowTaskHistory] = useState(false); // State to control Task History visibility

  const closeSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  // const handleUpdateMarks = async (updatedMarks) => {
  //   try {
  //     await axios.put(`http://localhost:5000/api/groups/${groupId}/marks`, { marks: updatedMarks });
  //     // await axios.put(`https://fypms-back-end.vercel.app/api/groups/${groupId}/marks`, { marks: updatedMarks });
  //     toast.success("Marks updated successfully");
  //     fetchGroupByNumber();

  //   } catch (err) {
  //     toast.error("An error occurred while updating marks");
  //   }
  // };


  const handleSubmitMarks = async (event) => {
    event.preventDefault();
    const updatedMarks = Array.from(event.target.elements)
      .filter(el => el.name && el.name !== 'phase')
      .map(el => ({
        studentId: el.name,
        marks: parseInt(el.value, 10),
      }));

    try {
      // await axios.put(`http://localhost:5000/api/groups/${groupId}/marks`, {
      await axios.put(`https://fypms-back-end.vercel.app/api/groups/${groupId}/marks`, {
        marks: updatedMarks,
        phase: selectedPhase,
      });
      toast.success("Marks updated successfully");
      fetchGroupByNumber();
    } catch (err) {
      toast.error("An error occurred while updating marks");
    }
  };

  const calculateTotalMarks = (marks) => {
    return marks.proposalDefense + marks.midEvaluation + marks.internalEvaluation + marks.externalEvaluation;
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.target);
  //   const updatedMarks = Array.from(formData.entries()).map(([username, value]) => {
  //     const member = group.members.find(member => member.username === username);
  //     if (member) {
  //       return {
  //         studentId: member._id,
  //         marks: parseInt(value, 10)
  //       };
  //     }
  //     return null;
  //   }).filter(mark => mark !== null);

  //   handleUpdateMarks(updatedMarks);
  // };

  const handleUpdatePhase = async (phase) => {
    const progressPercentage = calculateProgressPercentage(phase);
    try {
      // await axios.put(`http://localhost:5000/api/groups/${group._id}/phase`, { phase, progressPercentage });
      await axios.put(`https://fypms-back-end.vercel.app/api/groups/${group._id}/phase`, { phase, progressPercentage });
      toast.success('Phase updated successfully');
      fetchGroupByNumber();

    } catch (err) {
      toast.error('An error occurred while updating the phase');
    }
  };


  const calculateProgressPercentage = (phase) => {
    switch (phase) {
      case "Proposal":
        return 16.67;
      case "Literature Review":
        return 33.33;
      case "Methodology":
        return 50;
      case "Implementation":
        return 66.67;
      case "Testing":
        return 83.33;
      case "Final Report":
        return 100;
      default:
        return 0;
    }
  };

  const projectPhases = [
    "Proposal",
    "Literature Review",
    "Methodology",
    "Implementation",
    "Testing",
    "Final Report"
  ];

  const handleAssignTasks = async (task) => {
    try {
      const formData = new FormData();
      formData.append('title', task.title);
      formData.append('description', task.description);
      formData.append('deadline', task.deadline);
      if (task.file) formData.append('file', task.file);

      // await axios.post(`http://localhost:5000/api/groups/${groupId}/tasks`, formData, {
      await axios.post(`https://fypms-back-end.vercel.app/api/groups/${groupId}/tasks`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchGroupByNumber();
      toast.success('Task updated');
    } catch (err) {
      toast.error('An error occurred while updating the task');
    }
  };

  const handleSubmitTask = async (taskId, file) => {
    try {
      const formData = new FormData();
      formData.append('taskId', taskId);
      formData.append('file', file);

      // const response = await axios.post(`http://localhost:5000/api/groups/${groupId}/tasks/submit`, formData, {
      const response = await axios.post(`https://fypms-back-end.vercel.app/api/groups/${groupId}/tasks/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchGroupByNumber();

      toast.success('Task submitted successfully');
    } catch (err) {
      toast.error('An error occurred while submitting the task');
    }
  };

  const handleFileSubmit = (taskId) => {
    const task = group.tasks.find(task => task._id === taskId);
    if (task) {
      const deadline = new Date(task.deadline);
      const now = new Date();
      if (deadline < now) {
        toast.error('The deadline for this task has passed. You cannot submit it now.');
        return;
      }
    }

    const inputFile = document.querySelector(`input[name="file-${taskId}"]`);
    if (inputFile && inputFile.files.length > 0) {
      const file = inputFile.files[0];
      handleSubmitTask(taskId, file);
    } else {
      toast.error('Please select a file to upload');
    }
  };


  const getPendingTasks = () => {
    const submittedTaskIds = (group.submissions || []).map(sub => sub.taskId);
    const now = new Date();
    return (group.tasks || []).filter(task => {
      const deadline = new Date(task.deadline);
      return !submittedTaskIds.includes(task._id) && deadline > now;
    });
  };


  const getTaskStatus = (taskId) => {
    const submittedTaskIds = (group.submissions || []).map(sub => sub.taskId.toString());
    const task = group.tasks.find(task => task._id === taskId);
    const deadline = new Date(task.deadline);
    const now = new Date();

    if (submittedTaskIds.includes(taskId.toString())) {
      return "Submitted";
    } else if (deadline < now) {
      return "Missed";
    } else {
      return "Pending";
    }
  };

  const handleCheckboxChange = (studentId) => {
    setAttendance(prevAttendance => prevAttendance.map(att =>
      att.studentId === studentId ? { ...att, present: !att.present } : att
    ));
  };

  const handleSubmitAtten = async (e) => {
    e.preventDefault();
    try {
      // await axios.post(`http://localhost:5000/api/groups/${groupId}/attendance`, {
      await axios.post(`https://fypms-back-end.vercel.app/api/groups/${groupId}/attendance`, {
        title,
        date,
        attendance,
      });
      fetchAttendance();
      fetchGroupByNumber();
      setDate('')
      setTitle('')
      toast.success('Attendance recorded successfully');
    } catch (error) {
      toast.error('Failed to record attendance');
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [groupId]);

  const fetchAttendance = async () => {
    try {
      // const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/attendance`);
      const response = await axios.get(`https://fypms-back-end.vercel.app/api/groups/${groupId}/attendance`);
      setOverallAttendance(response.data.overallAttendance);
      setDetailedRecords(response.data.detailedRecords);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Failed to load attendance data');
    }
  };

  // Function to determine the color based on attendance percentage
  const getColor = (percentage) => {
    if (percentage >= 90) return '#00FF00'; // A+: Green
    if (percentage >= 85) return '#32CD32'; // A: Lime Green
    if (percentage >= 80) return '#ADFF2F'; // A-: Green Yellow
    if (percentage >= 75) return '#FFFF00'; // B+: Yellow
    if (percentage >= 70) return '#FFD700'; // B: Gold
    if (percentage >= 65) return '#FFA500'; // B-: Orange
    if (percentage >= 60) return '#FF8C00'; // C+: Dark Orange
    if (percentage >= 50) return '#FF4500'; // C: Orange Red
    if (percentage >= 45) return '#FF6347'; // C-: Tomato
    if (percentage >= 40) return '#FF0000'; // D+: Red
    if (percentage >= 35) return '#D32F2F'; // D: Dark Red
    if (percentage >= 30) return '#C62828'; // D-: Red
    return '#B71C1C'; // F: Deep Red
  };


  const data = {
    labels: overallAttendance.map(record => record.username),
    datasets: [
      {
        label: 'Attendance Percentage',
        data: overallAttendance.map(record => record.attendancePercentage),
        backgroundColor: overallAttendance.map(record => getColor(record.attendancePercentage)),
        borderColor: overallAttendance.map(record => getColor(record.attendancePercentage)),
        borderWidth: 1,
      },
    ],
  };

  // Options for the chart
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },

    },
  };

  const customStyles = {
    path: {
      stroke: `#007bff`, // Change path color
    },
    trail: {
      stroke: '#D6D6D6', // Change trail color
    },
    text: {
      fill: '#007bff', // Change text color
      fontSize: '16px',
    },
  };


  const handleRoomCode = () => {
    setFinalRoomCode(RoomCode);
    setIsRoomCodeVis(false);

    // Construct the URL with query parameters
    const url = `/room/${RoomCode}?agenda=${encodeURIComponent(meetingAgenda)}&number=${encodeURIComponent(group.number)}`;

    // Open the Room component in a new tab
    window.open(url, '_blank');
  };

  const handleRoomCodeStudent = () => {
    setFinalRoomCode(RoomCode);
    setIsRoomCodeVis(false);

    // Construct the URL with query parameters
    const url = `/room/${RoomCode}`;

    // Open the Room component in a new tab
    window.open(url, '_blank');
  };



  const progress = group.progress || 0; // Assuming group.progress is a number between 0 and 100

  if (loading) return <p>Loading...</p>;

  if (!group || !attendance.length) {
    return <p>No group or attendance data available. Relaod the page</p>;
  }


  return (
    <>
      <div className="fyp-dashboard" onClick={closeSidebar}>
        <button className="hamburger" onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(!isSidebarOpen); }}>
          &#9776;
        </button>
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div>
            <p className="Logoword">Project Dashboard</p>
          </div>
          <ul>
            {role === 'Committee' ? (
              <>
                <li onClick={() => setSelectedComponent("Dashboard")}>Dashboard</li>
                <li onClick={() => setSelectedComponent("Update Marks")}>Update Marks</li>
                <li onClick={() => setSelectedComponent("Attendance Records")}>Attendance Records</li>
                <li onClick={() => setSelectedComponent("Meeting Records")}>Meeting Records</li>
                <li onClick={() => setSelectedComponent("Task History")}>Task History</li>
                <Link to={'/CommitteeDashboard'} style={{ textDecoration: 'none', color: 'white' }}><li>Go Back</li></Link>
              </>
            ) : role === 'Supervisor' ? (
              <>
                <li onClick={() => setSelectedComponent("Dashboard")}>Dashboard</li>
                <li onClick={() => setSelectedComponent("Update Marks")}>Update Marks</li>
                <li onClick={() => setSelectedComponent("Update Phase")}>Update Phase</li>
                <li onClick={() => setSelectedComponent("Update Attendance")}>Update Attendance</li>
                <li onClick={() => setSelectedComponent("Attendance Records")}>Attendance Records</li>
                <li onClick={() => setSelectedComponent("Schedule Meeting")}>Schedule Meeting</li>
                <li onClick={() => setSelectedComponent("Meeting")}>Meeting</li>
                <li onClick={() => setSelectedComponent("Meeting Records")}>Meeting Records</li>
                <li onClick={() => setSelectedComponent("Update Tasks")}>Assing Tasks</li>
                <li onClick={() => setSelectedComponent("View Submissions")}>View Submissions</li>
                <li onClick={() => setSelectedComponent("Task History")}>Task History</li>
                <Link to={'/SuperDashboard'} style={{ textDecoration: 'none', color: 'white' }}><li>Go Back</li></Link>
              </>
            ) : role === 'Student' ? (
              <>
                <li onClick={() => setSelectedComponent("Dashboard")}>Dashboard</li>
                <li onClick={() => setSelectedComponent("View Marks")}>View Marks</li>
                <li onClick={() => setSelectedComponent("View Tasks")}>View Tasks</li>
                <li onClick={() => setSelectedComponent("Submit Tasks")}>Submit Tasks</li>
                <li onClick={() => setSelectedComponent("Attendance Records")}>Attendance Records</li>
                <li onClick={() => setSelectedComponent("Zoom Meeting")}>Zoom Meeting</li>
                <li onClick={() => setSelectedComponent("Meeting")}>Meeting</li>
                <li onClick={() => setSelectedComponent("Meeting Records")}>Meeting Records</li>
                <li onClick={() => setSelectedComponent("Task History")}>Task History</li>
                <Link to={'/StudentDashboard'} style={{ textDecoration: 'none', color: 'white' }}><li>Go Back</li></Link>
              </>
            ) : (
              <li>No options available</li>
            )}
          </ul>
        </div>
        {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
        <div className="content">
          {selectedComponent === 'Dashboard' && (
            <div className="container">
              {loading ? (
                <p>Loading data...</p>
              ) : (
                <div className="flex flex-col gap-5">
                  <h2 className="font-bold text-3xl underline text-center">Group {group.number}</h2>
                  <p className="font-normal"><span className=" text-xl  font-semibold mr-16">Supervisor:</span> {group.supervisor.name}</p>
                  <p className="font-normal"><span className=" text-xl  font-semibold mr-16">Project Title:</span> {group.projectTitle}</p>
                  <p className="font-normal"><span className=" text-xl  font-semibold mr-12">Project Phase:</span> {group.phase || 'Not updated yet'}</p>

                  <h3 className="text-xl font-semibold">Members</h3>
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="py-2 px-4 border-b text-left border-gray-200">Name</th>
                        <th className="py-2 px-4 border-b text-left border-gray-200">Roll No</th>
                        <th className="py-2 px-4 border-b text-left border-gray-200">Total Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.members.map((student) => {
                        const memberMarks = group.marks.find(mark => mark.studentId._id === student._id);

                        return (
                          <tr key={student.username}>
                            <td className="py-2 px-4 border-b border-gray-200">{student.name}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{student.username}</td>
                            <td className="py-2 px-4 border-b ">{memberMarks ? calculateTotalMarks(memberMarks) : 0}</td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* <p className="font-normal"><span className=" text-xl  font-semibold mr-8">Project Progress:</span>{group.progress ? `${group.progress}%` : 'Not updated yet'}</p> */}
                  <h2 className="text-xl font-semibold">Project Progress</h2>

                  <div className="flex items-center justify-center w-full ">

                    <div style={{ width: '200px' }}> {/* Adjust width as per your design */}
                      <CircularProgressbar value={progress} text={`${progress}%`} styles={customStyles} />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">Attendance</h2>
                    <Bar data={data} options={options} />
                  </div>
                </div>
              )}
            </div>
          )}
          {selectedComponent === 'Update Marks' && (

            <>
              <div className="container">
                {loading ? (
                  <p>Loading data...</p>
                ) : (
                  <>
                    <h2 className="font-bold text-3xl">Update Marks</h2>
                    <form onSubmit={handleSubmitMarks} className="mt-10">
                      <div className="flex flex-col gap-1 mb-5">
                        <label className="font-semibold">Select Phase:</label>
                        <select value={selectedPhase} onChange={(e) => setSelectedPhase(e.target.value)} className="p-3 font-medium border rounded">
                          <option value="proposalDefense">Proposal Defense</option>
                          <option value="midEvaluation">Mid Evaluation</option>
                          <option value="internalEvaluation">Internal Evaluation</option>
                          <option value="externalEvaluation">External Evaluation</option>
                        </select>
                      </div>
                      {group.members.map((student) => (
                        <div key={student.username} className="flex flex-col gap-1">
                          <label className="font-semibold">
                            {student.name} ({student.username}):{" "}
                            <input
                              type="number"
                              name={student._id}
                              className="p-3 font-medium"
                              // defaultValue={group.marks.find(mark => mark.studentId._id === student._id)?.[selectedPhase] || 0}
                              defaultValue={0}
                            />
                          </label>
                          <br />
                        </div>
                      ))}

                      <button type="submit" className="bg-primarycolor hover:bg-primarycolorhover p-3 text-white">Save Marks</button>
                    </form>
                  </>
                )}


                <div className="mt-10 mx-auto">
                  <h2 className="text-3xl font-bold mb-4">Marks Table</h2>
                  <table className="min-w-full bg-white border">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="py-2 px-4 border-b">Sr. No</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Roll No</th>
                        <th className="py-2 px-4 border-b">Proposal Marks</th>
                        <th className="py-2 px-4 border-b">Mid Evaluation Marks</th>
                        <th className="py-2 px-4 border-b">Internal Marks</th>
                        <th className="py-2 px-4 border-b">External Marks</th>
                        <th className="py-2 px-4 border-b">Total Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.members.map((member, index) => {
                        const memberMarks = group.marks.find(mark => mark.studentId._id === member._id);
                        return (
                          <tr key={member._id}>
                            <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                            <td className="py-2 px-4 border-b text-center">{member.name}</td>
                            <td className="py-2 px-4 border-b text-center">{member.username}</td>
                            <td className="py-2 px-4 border-b text-center">{memberMarks ? memberMarks.proposalDefense : 0}</td>
                            <td className="py-2 px-4 border-b text-center">{memberMarks ? memberMarks.midEvaluation : 0}</td>
                            <td className="py-2 px-4 border-b text-center">{memberMarks ? memberMarks.internalEvaluation : 0}</td>
                            <td className="py-2 px-4 border-b text-center">{memberMarks ? memberMarks.externalEvaluation : 0}</td>
                            <td className="py-2 px-4 border-b text-center">{memberMarks ? calculateTotalMarks(memberMarks) : 0}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>



            </>

          )}
          {selectedComponent === 'Schedule Meeting' && (

            <>
              <div className="container">
                {loading ? (
                  <p>Loading data...</p>
                ) : (
                  <>
                    <ScheduleMeeting groupnumber={group.number} />
                  </>
                )}
              </div>
            </>
          )}
          {selectedComponent === 'Zoom Meeting' && (
            <>
              <div className="container">
                {loading ? (
                  <p>Loading data...</p>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </>
          )}
          {selectedComponent === 'View Marks' && (

            <div className="container mx-auto">
              <h2 className="text-2xl font-bold mb-4">Marks Table</h2>
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4 border-b">Sr. No</th>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Roll No</th>
                    <th className="py-2 px-4 border-b">Proposal Marks</th>
                    <th className="py-2 px-4 border-b">Mid Evaluation Marks</th>
                    <th className="py-2 px-4 border-b">Internal Marks</th>
                    <th className="py-2 px-4 border-b">External Marks</th>
                    <th className="py-2 px-4 border-b">Total Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {group.members.map((member, index) => {
                    const memberMarks = group.marks.find(mark => mark.studentId._id === member._id);
                    return (
                      <tr key={member._id}>
                        <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                        <td className="py-2 px-4 border-b text-center">{member.name}</td>
                        <td className="py-2 px-4 border-b text-center">{member.username}</td>
                        <td className="py-2 px-4 border-b text-center">{memberMarks ? memberMarks.proposalDefense : 0}</td>
                        <td className="py-2 px-4 border-b text-center">{memberMarks ? memberMarks.midEvaluation : 0}</td>
                        <td className="py-2 px-4 border-b text-center">{memberMarks ? memberMarks.internalEvaluation : 0}</td>
                        <td className="py-2 px-4 border-b text-center">{memberMarks ? memberMarks.externalEvaluation : 0}</td>
                        <td className="py-2 px-4 border-b text-center">{memberMarks ? calculateTotalMarks(memberMarks) : 0}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          )}
          {selectedComponent === 'Update Attendance' && (
            <>
              <div className="container">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <form onSubmit={handleSubmitAtten} className="mt-10">
                    <h2 className="font-bold text-3xl">Add Attendance Record</h2>
                    <label className="block mt-4">
                      Title:
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="p-2 border border-gray-300"
                        placeholder="Meeting Agenda"
                        required
                      />
                    </label>
                    <label className="block mt-4">
                      Meeting Date:
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="p-2 border border-gray-300"
                        required
                      />
                    </label>
                    <div className="mt-5 ">
                      <table className="w-full table-fixed">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="w-1/3 p-2">Name</th>
                            <th className="w-1/3 p-2">Roll No</th>
                            <th className="w-1/3 p-2">Attendance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.members.map(student => (
                            <tr key={student._id} className="border-t">
                              <td className="p-2">{student.name}</td>
                              <td className="p-2">{student.username}</td>
                              <td className="p-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={attendance.find(att => att.studentId === student._id)?.present || false}
                                  onChange={() => handleCheckboxChange(student._id)}
                                  className="mr-2"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <button type="submit" className="bg-primarycolor hover:bg-primarycolorhover p-3 text-white mt-4">
                      Save Record
                    </button>
                  </form>
                )}
              </div>
            </>

          )}
          {selectedComponent === 'Meeting' && (
            <>
              <div className="container">
                {/* {isRoomCodeVis && */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleRoomCode()
                  }}
                  className="text-black "
                >
                  <h1 className="text-3xl text-center font-bold pt-6">
                    Meeting
                  </h1>
                  <div className="flex flex-col gap-5 mt-5">
                    <div className="flex items-center gap-5">
                      <label className="font-semibold text-xl">
                        Room Code:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter Room Code"
                        value={RoomCode}
                        readOnly // Make the input field non-editable
                        onChange={(e) => setRoomCode(e.target.value)}
                        className="py-1.5 md:py-2 px-4 rounded-full max-w-[14rem] text-black outline-0"
                      />
                    </div>

                    {
                      role === "Student" ? (
                        <>
                        </>

                      ) : (
                        <div className="flex items-center gap-5">
                          <label className="font-semibold text-xl">
                            Meeting Agenda:
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Title"
                            value={meetingAgenda}
                            onChange={(e) => setMeetingAgenda(e.target.value)}
                            className="py-1.5 md:py-2 px-4 rounded-full max-w-[14rem] text-black outline-0"
                          />
                        </div>

                      )
                    }



                    <button
                      type="submit"
                      className=" bg-blue-500 hover:bg-blue-400 duration-100 text-white ease-out font-bold w-[5rem] md:w-[7rem] rounded-full py-[5px] md:py-[7px] mt-2 md:mt-4 "
                    >
                      Go
                    </button>
                  </div>

                </form>
                {/* } */}

              </div>
            </>
          )}
          {selectedComponent === 'Meeting Records' && (
            <>
              <div className="flex flex-col items-start justify-start container">
                <h1 className="text-3xl font-bold mb-4 text-center w-full">Meetings Records</h1>
                {meetingsData && meetingsData.meetings.length === 0 ? (
                  <p>No meetings available for this group</p>
                ) : (
                  meetingsData.meetings.map((meeting) => (
                    <div key={meeting._id} className="mt-4 bg-gray-100 text-black p-4 rounded shadow-lg w-full max-w-lg">
                      <h2 className="text-xl font-bold mb-2">Meeting Agenda: {meeting.meetingAgenda}</h2>
                      <p className="mb-2"><strong>Date:</strong> {new Date(meeting.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <audio controls src={meeting.audioUrl} />

                      <h3 className="text-lg font-semibold mb-2">Transcript:</h3>
                      <p className="mb-2">{meeting.transcription}</p>
                      <h3 className="text-lg font-semibold mb-2">Summary:</h3>
                      <ul>
                        {meeting.summary.split('\n').map((line, index) => (
                          <li key={index}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>

            </>
          )}
          {selectedComponent === 'Attendance Records' && (
            <>

              <div className="container">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <>

                    <h2 className="font-bold text-3xl">Attendance Records</h2>
                    <ul className="mt-10 mb-10">
                      <h2 className="font-bold text-2xl">Overall Attendance</h2>
                      <table className="mt-4 w-full table-auto">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Roll Number</th>
                            <th className="px-4 py-2 text-left">Attendance (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {overallAttendance.map(record => (
                            <tr key={record.studentId} className="mb-4">
                              <td className="border px-4 py-2">{record.name}</td>
                              <td className="border px-4 py-2">{record.username}</td>
                              <td className="border px-4 py-2">{record.attendancePercentage}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>


                      <h2 className="font-bold text-2xl mt-10 mb-5">Meetings Summary</h2>

                      {detailedRecords.map((record, index) => (

                        <div className="flex gap-5">
                          <h3 className="font-semibold">{index + 1}.</h3>


                          <li key={record._id} className="flex flex-col gap-5  mb-4">
                            <div className="flex flex-col gap-3 ">

                              <h3 className="font-semibold">Meeting Agenda: <span className="font-normal"> {record.title}</span></h3>
                              <h3 className="font-semibold">Meeting Date:  <span className="font-normal">  {new Date(record.date).toLocaleDateString()} </span></h3>
                              <div className="flex gap-5">

                                <h3 className="font-semibold">Attendance:</h3>
                                <ul>
                                  {record.attendance.map(att => (
                                    <li key={att.studentId._id}>
                                      {att.name}
                                      ({att.username}):
                                      {att.present ? 'Present' : 'Absent'}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                          </li>
                        </div>

                      ))}
                    </ul>
                  </>
                )}
              </div>
            </>

          )}
          {selectedComponent === 'Update Phase' && (

            <div className="container">
              <h2 className="font-bold text-3xl ">Update Phase</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const phase = e.target.elements.progress.value;
                handleUpdatePhase(phase);
              }}
                className="mt-10">
                <label className="font-semibold">
                  Phase:
                  <select name="progress" className="ml-5 p-2 border-2 rounded" defaultValue={group.phase || projectPhases[0]}>
                    {projectPhases.map((phase) => (
                      <option key={phase} value={phase}>{phase}</option>
                    ))}
                  </select>
                </label>
                <button type="submit" className=" mt-10 bg-primarycolor hover:bg-primarycolorhover p-3 text-white">Save Phase</button>
              </form>
            </div>
          )}
          {selectedComponent === 'Update Tasks' && (

            <>
              <div className="container">
                <h2 className="font-bold text-3xl">Assign Tasks</h2>
                <form
                  className="mt-10"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const task = {
                      title: formData.get('title'),
                      description: formData.get('description'),
                      deadline: formData.get('deadline'),
                      file: formData.get('file'),
                    };
                    handleAssignTasks(task);
                    e.target.reset();
                  }}
                >
                  <div>
                    <label className="font-semibold">
                      Task Title:{' '}
                      <input type="text" name="title" className="p-3 font-medium" required />
                    </label>
                  </div>

                  <div className="flex flex-col mt-5">
                    <label className="font-semibold">
                      Description:{' '}
                    </label>
                    <textarea name="description" className="p-3 font-medium border-2 rounded" required></textarea>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between mt-5">


                    <label className="font-semibold">
                      File:{' '}
                      <input type="file" className="font-medium p-3" name="file" />
                    </label>
                    <label className="font-semibold mt-5 md:mt-0">
                      Deadline:{' '}
                      {/* <input type="date" name="deadline" className="p-3 font-medium" required /> */}
                      <input type="date" name="deadline" className="p-3 font-medium" required min={minDate} />
                    </label>
                  </div>
                  <button type="submit" className="mt-10 bg-primarycolor hover:bg-primarycolorhover p-3 text-white">Assign Task</button>
                </form>

                <div className="mt-10">
                  <h2 className="font-bold text-3xl">Assigned Tasks</h2>
                  {group.tasks && group.tasks.length > 0 ? (

                    <div className="overflow-x-auto mt-10">
                      <table className="min-w-full bg-white">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="py-2 px-4 border-b text-nowrap w-1/6">Task Title</th>
                            <th className="py-2 px-4 border-b text-nowrap w-1/6">Description</th>
                            <th className="py-2 px-4 border-b text-nowrap w-1/6">Assigned On</th>
                            <th className="py-2 px-4 border-b text-nowrap w-1/6">Deadline</th>
                            <th className="py-2 px-4 border-b text-nowrap w-1/6">Status</th>

                            <th className="py-2 px-4 border-b text-nowrap w-1/6">File</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.tasks.map((task, index) => (
                            <tr key={index} className="text-center ">
                              <td className="py-5 px-4 border-b  text-nowrap w-1/6">{task.title}</td>
                              <td className="py-5 px-4 border-b  text-justify min-w-1/6 ">{task.description}</td>
                              <td className="py-5 px-4 border-b  text-nowrap w-1/6">
                                {new Date(task.timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </td>
                              <td className="py-5 px-4 border-b  text-nowrap w-1/6">
                                {new Date(task.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </td>
                              <td className="py-5 px-4 border-b  text-nowrap w-1/6">
                                <p className="font-medium">{getTaskStatus(task._id)}</p>  {/* Pass task._id instead of task.title */}
                              </td>
                              <td className="py-5 px-4 border-b  text-nowrap w-1/6">
                                {task.filePath && (
                                  // <a href={`http://localhost:5000/${task.filePath}`} className="bg-primarycolor hover:bg-primarycolorhover p-2 text-white rounded" target="_blank" rel="noopener noreferrer" download>
                                  <a href={`${task.filePath}`} className="bg-primarycolor hover:bg-primarycolorhover p-2 text-white rounded" target="_blank" rel="noopener noreferrer" download>
                                    Download File
                                  </a>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>No tasks assigned.</p>
                  )}
                </div>
              </div>
            </>

          )}
          {selectedComponent === 'View Submissions' && (
            <div className="container">
              <h2 className="font-bold text-3xl">View Submissions</h2>
              {group.submissions && group.submissions.length > 0 ? (

                <div className="mt-10">
                  <table className="min-w-full border-collapse border border-gray-200 mt-5">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="px-4 py-2 text-left">Task Title</th>
                        <th className="px-4 py-2 text-left">Submitted</th>
                        <th className="px-4 py-2 text-left">File</th>
                      </tr>
                    </thead>

                    <tbody>
                      {group.submissions.map((submission, index) => {
                        // Find the task in the group’s tasks array
                        const task = group.tasks.find(task => task._id.toString() === submission.taskId.toString());

                        return (
                          <tr key={index} className="border-b">
                            <td className="px-4 py-4">
                              {task ? task.title : 'Unknown Task'}
                            </td>
                            <td className="px-4 py-4">
                              {new Date(submission.timestamp).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="px-4 py-4">
                              {submission.filePath ? (
                                <a
                                  // href={`http://localhost:5000/${submission.filePath}`}
                                  href={`${submission.filePath}`}
                                  className="bg-primarycolor hover:bg-primarycolorhover p-2 text-white rounded"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                >
                                  Download File
                                </a>
                              ) : (
                                'No File'
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>

                  </table>
                </div>

              ) : (
                <p>No submissions available.</p>
              )}
            </div>
          )}
          {selectedComponent === 'Submit Tasks' && (

            <div className="container mt-10">
              <h2 className="font-bold text-3xl">Submit Task</h2>
              <div className="overflow-x-auto mt-5">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="py-2 px-4 border-b w-1/6">Task Title</th>
                      <th className="py-2 px-4 border-b w-1/6">Deadline</th>
                      <th className="py-2 px-4 border-b w-1/6">Upload File</th>
                      <th className="py-2 px-4 border-b w-1/6">Submit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPendingTasks().map((task, index) => (
                      <tr key={index} className="text-center">
                        <td className="py-2 px-4 border-b w-1/6">{task.title}</td>
                        <td className="py-2 px-4 border-b w-1/6">
                          {new Date(task.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-2 px-4 border-b w-1/6">
                          <input type="file" name={`file-${task._id}`} className="p-3" required />
                        </td>
                        <td className="py-2 px-4 border-b w-1/6">
                          <button
                            onClick={() => handleFileSubmit(task._id)}
                            className="bg-primarycolor hover:bg-primarycolorhover p-2 text-white rounded"
                          >
                            Submit Task
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>


          )}
          {selectedComponent === 'View Tasks' && (
            <div className="container">
              <h2 className="font-bold text-3xl">View Tasks</h2>
              <div className="mt-10">
                {group.tasks && group.tasks.length > 0 ? (
                  <div className="overflow-x-auto mt-10">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="py-2 px-4 border-b text-nowrap w-1/6">Task Title</th>
                          <th className="py-2 px-4 border-b text-nowrap w-1/6">Description</th>
                          <th className="py-2 px-4 border-b text-nowrap w-1/6">Assigned On</th>
                          <th className="py-2 px-4 border-b text-nowrap w-1/6">Deadline</th>
                          <th className="py-2 px-4 border-b text-nowrap w-1/6">Status</th>
                          <th className="py-2 px-4 border-b text-nowrap w-1/6">File</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.tasks.map((task, index) => (

                          <tr key={index} className="text-center ">
                            <td className="py-5 px-4 border-b  text-nowrap w-1/6">{task.title}</td>
                            <td className="py-5 px-4 border-b  text-justify w-1/6 ">{task.description}</td>
                            <td className="py-5 px-4 border-b  text-nowrap w-1/6">
                              {new Date(task.timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="py-5 px-4 border-b  text-nowrap w-1/6">
                              {new Date(task.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>

                            <td className="py-5 px-4 border-b  text-nowrap w-1/6">
                              <p className="font-medium">{getTaskStatus(task._id)}</p>  {/* Pass task._id instead of task.title */}
                            </td>
                            <td className="py-5 px-4 border-b  text-nowrap w-1/6">
                              {task.filePath && (
                                // <a href={`http://localhost:5000/${task.filePath}`} className="bg-primarycolor hover:bg-primarycolorhover p-2 text-white rounded" target="_blank" rel="noopener noreferrer" download>
                                <a href={`${task.filePath}`} className="bg-primarycolor hover:bg-primarycolorhover p-2 text-white rounded" target="_blank" rel="noopener noreferrer" download>
                                  Download File
                                </a>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No tasks assigned.</p>
                )}
              </div>
            </div>
          )}
          {selectedComponent === 'Task History' && (
            <div className="container">
              <h2 className="font-bold text-3xl">Task History</h2>

              {group.tasks && group.tasks.length > 0 ? (
                <div className="overflow-x-auto mt-10">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="py-2 px-4 border-b text-nowrap w-1/6">Task Title</th>
                        <th className="py-2 px-4 border-b text-nowrap w-1/6">Description</th>
                        <th className="py-2 px-4 border-b text-nowrap w-1/6">Assigned On</th>
                        <th className="py-2 px-4 border-b text-nowrap w-1/6">Deadline</th>
                        <th className="py-2 px-4 border-b text-nowrap w-1/6">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.tasks.map((task, index) => (
                        <tr key={index} className="text-center ">
                          <td className="py-5 px-4 border-b  text-nowrap w-1/6">{task.title}</td>
                          <td className="py-5 px-4 border-b  text-justify min-w-1/6 ">{task.description}</td>
                          <td className="py-5 px-4 border-b  text-nowrap w-1/6">
                            {new Date(task.timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-5 px-4 border-b  text-nowrap w-1/6">
                            {new Date(task.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-5 px-4 border-b  text-nowrap w-1/6">
                            <p className="font-medium">{getTaskStatus(task._id)}</p>  {/* Pass task._id instead of task.title */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No tasks available.</p>
              )}
            </div>
          )}
        </div>
      </div >

      <Toaster />

    </>
  );
}

export default ProjectDashboard;
