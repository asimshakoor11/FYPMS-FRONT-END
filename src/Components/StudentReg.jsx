import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentReg() {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('FA20-BSE-');
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  const handleAddStudent = async () => {
    if (name && rollNumber) {
      try {
        // await axios.post('http://localhost:5000/api/students/register', {
          await axios.post('https://fypms-back-end.vercel.app/api/students/register', {
          name,
          username: rollNumber,
          password: 'student@123', // Default password
        });
        alert('Student registered successfully');
        setName('');
        setRollNumber('FA20-BSE-');
        setError('');
        fetchStudents(); // Optional: Refresh student list after registration
      } catch (error) {
        setError(error.response.data.message || 'Registration failed.');
      }
    } else {
      setError('Please fill in all fields.');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [])

  const fetchStudents = async () => {
    try {
      // const response = await axios.get('http://localhost:5000/api/students');
      const response = await axios.get('https://fypms-back-end.vercel.app/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };
  
  const handleDeleteStudent = async (username) => {
    try {
      // await axios.delete(`http://localhost:5000/api/students/${username}`);
      await axios.delete(`https://fypms-back-end.vercel.app/api/students/${username}`);
      fetchStudents(); // Refresh student list after deletion
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <div className="student-reg-container">
      <h1>Register Student</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Roll Number"
          value={rollNumber}
          onChange={(e) => {
            setRollNumber(e.target.value);
            setError('');
          }}
        />
        <button onClick={handleAddStudent}>Add Student</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <ul className="students-list">
        {students.map((student, index) => (
          <li className="list-item" key={index}>
            <p>
              <b>Name:</b> {student.name} <br />
              <b>Roll No:</b> {student.username}
            </p>
            <button onClick={() => handleDeleteStudent(student.username)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentReg;
