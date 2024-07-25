import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "./Styles/CommitteDashboard.css";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';


function ProjectDashboard() {
  const location = useLocation();
  const { groupId } = useParams();
  const [role, setRole] = useState('');
  const [group, setGroup] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token){
            navigate('/')
        }
    })

  const fetchGroupByNumber = async () => {
    try {
      // const response = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
      const response = await axios.get(`https://fypms-back-end.vercel.app/api/groups/${groupId}`);
      setGroup(response.data);
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


  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);


  const [selectedComponent, setSelectedComponent] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTaskHistory, setShowTaskHistory] = useState(false); // State to control Task History visibility

  const closeSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };
  const handleUpdateMarks = async (updatedMarks) => {
    try {
      // await axios.put(`http://localhost:5000/api/groups/${groupId}/marks`, { marks: updatedMarks });
      await axios.put(`https://fypms-back-end.vercel.app/api/groups/${groupId}/marks`, { marks: updatedMarks });
      toast.success("Marks updated successfully");
      fetchGroupByNumber();

    } catch (err) {
      toast.error("An error occurred while updating marks");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedMarks = Array.from(formData.entries()).map(([username, value]) => {
      const member = group.members.find(member => member.username === username);
      if (member) {
        return {
          studentId: member._id,
          marks: parseInt(value, 10)
        };
      }
      return null;
    }).filter(mark => mark !== null);

    handleUpdateMarks(updatedMarks);
  };

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

  // const handleFileSubmit = (taskId) => {
  //   const inputFile = document.querySelector(`input[name="file-${taskId}"]`);
  //   if (inputFile && inputFile.files.length > 0) {
  //     const file = inputFile.files[0];
  //     handleSubmitTask(taskId, file);
  //   } else {
  //     alert('Please select a file to upload');
  //   }
  // };

  // const getPendingTasks = () => {
  //   const submittedTaskIds = (group.submissions || []).map(sub => sub.taskId);
  //   return (group.tasks || []).filter(task => !submittedTaskIds.includes(task._id));
  // };

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


  // // Function to determine if a task is submitted or pending
  // const getTaskStatus = (taskId) => {
  //   const submittedTaskIds = (group.submissions || []).map(sub => sub.taskId.toString());
  //   return submittedTaskIds.includes(taskId.toString()) ? "Submitted" : "Pending";
  // };

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
                <li onClick={() => setSelectedComponent("Task History")}>Task History</li>
                <Link to={'/CommitteeDashboard'} style={{ textDecoration: 'none', color: 'white' }}><li>Go Back</li></Link>
              </>
            ) : role === 'Supervisor' ? (
              <>
                <li onClick={() => setSelectedComponent("Dashboard")}>Dashboard</li>
                <li onClick={() => setSelectedComponent("Update Marks")}>Update Marks</li>
                <li onClick={() => setSelectedComponent("Update Phase")}>Update Phase</li>
                <li onClick={() => setSelectedComponent("Update Tasks")}>Assing Tasks</li>
                <li onClick={() => setSelectedComponent("View Submissions")}>View Submissions</li>
                <li onClick={() => setSelectedComponent("Task History")}>Task History</li>
                <Link to={'/SuperDashboard'} style={{ textDecoration: 'none', color: 'white' }}><li>Go Back</li></Link>
              </>
            ) : role === 'Student' ? (
              <>
                <li onClick={() => setSelectedComponent("Dashboard")}>Dashboard</li>
                <li onClick={() => setSelectedComponent("View Tasks")}>View Tasks</li>
                <li onClick={() => setSelectedComponent("Submit Tasks")}>Submit Tasks</li>
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
                  <p className="font-normal"><span className=" text-lg  font-semibold mr-16">Supervisor:</span> {group.supervisor.name}</p>
                  <p className="font-normal"><span className=" text-lg  font-semibold mr-16">Project Title:</span> {group.projectTitle}</p>
                  <p className="font-normal"><span className=" text-lg  font-semibold mr-12">Project Phase:</span> {group.phase || 'Not updated yet'}</p>
                  <p className="font-normal"><span className=" text-lg  font-semibold mr-8">Project Progress:</span>{group.progress ? `${group.progress}%` : 'Not updated yet'}</p>

                  <h3 className="text-lg font-semibold">Members</h3>
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="py-2 px-4 border-b text-left border-gray-200">Name</th>
                        <th className="py-2 px-4 border-b text-left border-gray-200">Roll No</th>
                        <th className="py-2 px-4 border-b text-left border-gray-200">Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.members.map((student) => {
                        const studentMarks = group.marks.find(mark => mark.studentId._id === student._id);
                        return (
                          <tr key={student.username}>
                            <td className="py-2 px-4 border-b border-gray-200">{student.name}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{student.username}</td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              {studentMarks ? studentMarks.marks : 'Not assigned'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {selectedComponent === 'Update Marks' && (
            <div className="container">
              {loading ? (
                <p>Loading data...</p>
              ) : (
                <>
                  <h2 className="font-bold text-3xl ">Update Marks</h2>
                  <form onSubmit={handleSubmit} className="mt-10">
                    {group.members.map((student) => {
                      const studentMarks = group.marks.find(mark => mark.studentId._id === student._id);
                      return (
                        <div key={student.username} className="flex flex-col gap-1">
                          <label className="font-semibold">
                            {student.name} ({student.username}):{" "}
                            <input
                              type="number"
                              name={student.username}
                              className="p-3 font-medium"
                              defaultValue={studentMarks ? studentMarks.marks : 0}
                            />
                          </label>
                          <br />
                        </div>
                      );
                    })}

                    <button type="submit" className="bg-primarycolor hover:bg-primarycolorhover p-3 text-white">Save Marks</button>
                  </form>
                </>
              )}
            </div>
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
                      <input type="date" name="deadline" className="p-3 font-medium" required />
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
                                  // <a href={`http://localhost:5000${task.filePath}`} className="bg-primarycolor hover:bg-primarycolorhover p-2 text-white rounded" target="_blank" rel="noopener noreferrer" download>
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
                                  // href={`http://localhost:5000${submission.filePath}`}
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
                                // <a href={`http://localhost:5000${task.filePath}`} className="bg-primarycolor hover:bg-primarycolorhover p-2 text-white rounded" target="_blank" rel="noopener noreferrer" download>
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
