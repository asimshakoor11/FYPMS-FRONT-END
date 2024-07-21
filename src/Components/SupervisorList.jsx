import React, { useState, useEffect } from "react";

import "./Styles/StudentList.css";
import axios from "axios";

const SupervisorsList = () => {
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

  return (
    <div className="student-list">
      <h2>SuperVisors List</h2>
      <ul>
        {supervisors.map((supervisor) => (
          <li key={supervisor.username}>
            {supervisor.name} - {supervisor.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupervisorsList;
