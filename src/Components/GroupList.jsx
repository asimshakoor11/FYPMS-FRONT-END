import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Styles/GroupList.css";

function GroupList() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/groups');
        setGroups(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setLoading(false); // Ensure loading state is updated even on error
      }
    };
    fetchGroups();
  }, []);

  const loggedInUser = localStorage.getItem("loggedInUser");
  const loggedInUserRole = localStorage.getItem("userRole");
  
  const handleGroupClick = (group) => {
    navigate({
      pathname: `/projectdashboard/${group.number}`,
      state: { group },
    });
  };

  let filteredGroups = [];


  if (loggedInUserRole === "Committee") {
    // Show all groups
    filteredGroups = groups;
  } else if (loggedInUserRole === "Supervisor") {
    // Show groups where logged-in user is supervisor
    filteredGroups = groups.filter(group => group.supervisor.username === loggedInUser);
  } else if (loggedInUserRole === "Student") {
    // Show groups where logged-in user is a member
    filteredGroups = groups.filter(group => group.members.some(member => member.username === loggedInUser));
  }

  return (
    <div className="group-list-container">
      <h2 className="group-list-header">Group List</h2>
      {loading ? (
        <p>Loading groups...</p>
      ) : filteredGroups.length === 0 ? (
        <p>No groups to display.</p>
      ) : (
        filteredGroups.map((group, index) => (
          <div key={index} className="group-container" style={{ cursor: 'pointer' }} onClick={() => handleGroupClick(group)}>
            <h3 className="group-header">Group {group.number}</h3>
            <p><strong>Supervisor:</strong> {group.supervisor.name}</p>
            <p><strong>Project Title:</strong> {group.projectTitle}</p>
            <ul>
              {group.members.map((student, idx) => (
                <li key={idx}>
                  {student.name} ({student.username})
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default GroupList;
