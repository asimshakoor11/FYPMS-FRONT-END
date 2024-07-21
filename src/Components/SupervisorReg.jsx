import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./Styles/SupervisorReg.css";

function SupervisorReg() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [supervisors, setSupervisors] = useState([]);

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/supervisors');
      setSupervisors(response.data);
    } catch (error) {
      console.error('Error fetching supervisors:', error);
      // Handle error (e.g., display error message)
    }
  };

  const handleAddSupervisor = async () => {
    if (name && id) {
      try {
        // await axios.post('http://localhost:5000/api/supervisors/register', {
          await axios.post('https://fypms-back-end.vercel.app/api/supervisors/register', {
          name,
          username: id,
          password: 'supervisor@123',
        });
        alert('Supervisor registered successfully');
        setName("");
        setId("");
        fetchSupervisors(); // Refresh supervisor list after registration
      } catch (error) {
        console.error('Supervisor registration error:', error);
        // Handle registration error (e.g., display error message)
      }
    }
  };

  const handleDeleteSupervisor = async (username) => {
    try {
      // await axios.delete(`http://localhost:5000/api/supervisors/${username}`);
      await axios.delete(`https://fypms-back-end.vercel.app/api/supervisors/${username}`);
      fetchSupervisors(); // Refresh supervisor list after deletion
    } catch (error) {
      console.error('Error deleting supervisor:', error);
      // Handle deletion error (e.g., display error message)
    }
  };

  return (
    <div className="supervisor-reg-container">
      <h1>Register Supervisor</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button onClick={handleAddSupervisor}>Add Supervisor</button>
      </div>
      <ul className="supervisor-list">
        {supervisors.map((supervisor, index) => (
          <li className="list-item" key={index}>
            <p>
              <b>Name:</b> {supervisor.name} <br />
              <b>ID:</b> {supervisor.username}
            </p>
            <button onClick={() => handleDeleteSupervisor(supervisor.username)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SupervisorReg;
