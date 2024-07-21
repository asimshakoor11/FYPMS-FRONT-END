import React, { useState, useEffect } from "react";
import "./Styles/StudentList.css";
import axios from "axios";

function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  return (
    <div className="student-list">
      <h2>Registered Students</h2>
      <ul>
        <li className="header">Name: Roll No</li>
        {students.map((student) => (
          <li key={student.username}>
            {student.name}: {student.username}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentList;
