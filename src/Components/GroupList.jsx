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
        // const response = await axios.get('http://localhost:5000/api/groups');
        const response = await axios.get('https://fypms-back-end.vercel.app/api/groups');
        const sortedGroups = response.data.sort((a, b) => a.number - b.number);
        setGroups(sortedGroups);
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
          <div key={index} className="mt-10 flex flex-col gap-4" style={{ cursor: 'pointer' }} >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-2xl underline">Group {group.number}</h3>
              <button
                onClick={() => handleGroupClick(group)}
                className="bg-primarycolor w-[150px] text-white px-4 py-2 rounded hover:bg-primarycolor"
              >
                Dashboard
              </button>
            </div>
            <p><strong>Supervisor:</strong> {group.supervisor.name}</p>
            <p><strong>Project Title:</strong> {group.projectTitle}</p>
            <h3 className="font-semibold text-xl">Members</h3>

            <div>
              <table className="w-full table-auto rounded ">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left w-1/2">Name</th>
                    <th className="px-4 py-2 text-left w-1/2">Roll Number</th>
                  </tr>
                </thead>
                <tbody>
                  {group.members.map((student, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-4 py-2">{student.name}</td>
                      <td className="px-4 py-2">{student.username}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default GroupList;
