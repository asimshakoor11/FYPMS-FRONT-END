import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./Styles/CommitteDashboard.css";
import axios from "axios";

function ProjectDashboard() {
  const location = useLocation();
  const { groupId } = useParams();
  const [role, setRole] = useState('');
  const [group, setGroup] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroupByNumber = async () => {
    try {
      // const response = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
      const response = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
      setGroup(response.data);
      setLoading(false);
    } catch (err) {
      setGroup([]);
      setLoading(false);
      if (err.response && err.response.status === 404) {
        alert('Group not found');
      } else {
        alert('An error occurred while fetching the group');
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
      alert("Marks updated successfully");
      fetchGroupByNumber();

    } catch (err) {
      alert("An error occurred while updating marks");
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
      alert('Phase updated successfully');
      fetchGroupByNumber();

    } catch (err) {
      alert('An error occurred while updating the phase');
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
      if (task.file) formData.append('file', task.file);

      // await axios.post(`http://localhost:5000/api/groups/${groupId}/tasks`, formData, {
        await axios.post(`https://fypms-back-end.vercel.app/api/groups/${groupId}/tasks`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchGroupByNumber();
      alert('Task updated');
    } catch (err) {
      alert('An error occurred while updating the task');
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

      alert('Task submitted successfully');
    } catch (err) {
      alert('An error occurred while submitting the task');
    }
  };

  const getPendingTasks = () => {
    const submittedTaskIds = (group.submissions || []).map(sub => sub.taskId);
    return (group.tasks || []).filter(task => !submittedTaskIds.includes(task._id));
  };

  // // Function to determine if a task is submitted or pending
  const getTaskStatus = (taskId) => {
    const submittedTaskIds = (group.submissions || []).map(sub => sub.taskId.toString());
    return submittedTaskIds.includes(taskId.toString()) ? "Submitted" : "Pending";
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
                <li onClick={() => setSelectedComponent("Update Tasks")}>Update Tasks</li>
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
            <div>
              {loading ? (
                <p>Loading data...</p>
              ) : (
                <>
                  <h2>Group {group.number}</h2>
                  <p><strong>Supervisor:</strong> {group.supervisor.name}</p>
                  <p><strong>Project Title:</strong> {group.projectTitle}</p>
                  <h3>Members</h3>
                  <ul>
                    {group.members.map((student) => {
                      const studentMarks = group.marks.find(mark => mark.studentId._id === student._id);
                      return (
                        <li key={student.username}>
                          {student.name} ({student.username}) - Marks: {studentMarks ? studentMarks.marks : 'Not assigned'}
                        </li>
                      );
                    })}
                  </ul>
                  <h3>Project Phase</h3>
                  <p>{group.phase || 'Not updated yet'}</p>
                  <h3>Project Progress</h3>
                  <p>{group.progress ? `${group.progress}%` : 'Not updated yet'}</p>
                </>
              )}
            </div>
          )}
          {selectedComponent === 'Update Marks' && (
            <div>
              {loading ? (
                <p>Loading data...</p>
              ) : (
                <>
                  <h2>Update Marks</h2>
                  <form onSubmit={handleSubmit}>
                    {group.members.map((student) => {
                      const studentMarks = group.marks.find(mark => mark.studentId._id === student._id);
                      return (
                        <div key={student.username}>
                          <label>
                            {student.name} ({student.username}):{" "}
                            <input
                              type="number"
                              name={student.username}
                              defaultValue={studentMarks ? studentMarks.marks : 0}
                            />
                          </label>
                          <br />
                        </div>
                      );
                    })}

                    <button type="submit">Save Marks</button>
                  </form>
                </>
              )}
            </div>
          )}
          {selectedComponent === 'Update Phase' && (

            <div>
              <h2>Update Phase</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const phase = e.target.elements.progress.value;
                handleUpdatePhase(phase);
              }}>
                <label>
                  Phase:
                  <select name="progress" defaultValue={group.phase || projectPhases[0]}>
                    {projectPhases.map((phase) => (
                      <option key={phase} value={phase}>{phase}</option>
                    ))}
                  </select>
                </label>
                <button type="submit">Save Phase</button>
              </form>
            </div>
          )}
          {selectedComponent === 'Update Tasks' && (
            <>
              <div>
                <h2>Update Tasks</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const task = {
                      title: formData.get('title'),
                      description: formData.get('description'),
                      file: formData.get('file'),
                    };
                    handleAssignTasks(task);
                    e.target.reset();
                  }}
                >
                  <label>
                    Task Title:{' '}
                    <input type="text" name="title" required />
                  </label>
                  <br />
                  <label>
                    Description:{' '}
                    <textarea name="description" required></textarea>
                  </label>
                  <br />
                  <label>
                    File:{' '}
                    <input type="file" name="file" />
                  </label>
                  <br />
                  <button type="submit">Assign Task</button>
                </form>

                <div>
                  {group.tasks && group.tasks.length > 0 ? (
                    <ul>
                      {group.tasks.map((task, index) => (
                        <li key={index}>
                          <h3>{task.title}</h3>
                          <p>{task.description}</p>
                          {task.filePath && (
                            <a href={`http://localhost:5000${task.filePath}`} target="_blank" rel="noopener noreferrer" download>
                              Download File
                            </a>
                          )}
                          <p>
                            <small>Assigned on: {new Date(task.timestamp).toLocaleString()}</small>
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No tasks assigned.</p>
                  )}
                </div>
              </div>
            </>
          )}
          {selectedComponent === 'View Submissions' && (
            <div>
              <h2>View Submissions</h2>
              {group.submissions && group.submissions.length > 0 ? (
                <ul>
                  {group.submissions.map((submission, index) => (
                    <li key={index}>
                      <h3>{submission.taskId.title}</h3>
                      <p>
                        <a href={`http://localhost:5000${submission.filePath}`} target="_blank" rel="noopener noreferrer" download>
                          Download Submission
                        </a>
                      </p>
                      <p><small>Submitted on: {new Date(submission.timestamp).toLocaleString()}</small></p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No submissions available.</p>
              )}
            </div>
          )}
          {selectedComponent === 'Submit Tasks' && (
            <div>
              <h2>Submit Tasks</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const taskId = formData.get('taskId');
                  const file = formData.get('file');
                  handleSubmitTask(taskId, file);
                  e.target.reset();
                }}
              >
                <label>
                  Select Task:{" "}
                  <select name="taskId" required>
                    {getPendingTasks().map((task, index) => (
                      <option key={index} value={task._id}>{task.title}</option>
                    ))}
                  </select>
                </label>
                <br />
                <label>
                  Upload File:{" "}
                  <input type="file" name="file" required />
                </label>
                <br />
                <button type="submit">Submit Task</button>
              </form>
            </div>
          )}
          {selectedComponent === 'View Tasks' && (
            <div>
              <h2>View Tasks</h2>
              <div>
                {group.tasks && group.tasks.length > 0 ? (
                  <ul>
                    {group.tasks.map((task, index) => (
                      <li key={index}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        {task.filePath && (
                          <a href={`http://localhost:5000${task.filePath}`} target="_blank" rel="noopener noreferrer" download>
                            Download File
                          </a>
                        )}
                        <p>
                          <small>Assigned on: {new Date(task.timestamp).toLocaleString()}</small>
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No tasks assigned.</p>
                )}
              </div>
            </div>
          )}
          {selectedComponent === 'Task History' && (
            <div>
              <h2>Task History</h2>
              <ul>
                {group.tasks && group.tasks.length > 0 ? (
                  group.tasks.map((task, index) => (
                    <li key={index}>
                      <h3>{task.title}</h3>
                      <p>Status: {getTaskStatus(task._id)}</p>  {/* Pass task._id instead of task.title */}
                    </li>
                  ))
                ) : (
                  <p>No tasks available.</p>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProjectDashboard;
