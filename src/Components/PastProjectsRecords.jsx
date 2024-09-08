import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PastProjectsRecords = () => {
  const [pastGroups, setPastGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const loggedInUser = localStorage.getItem("loggedInUser");
  const loggedInUserRole = localStorage.getItem("userRole");

  useEffect(() => {
    const fetchPastGroups = async () => {
      try {
        // const response = await axios.get('http://localhost:5000/api/past-groups');
        const response = await axios.get('https://fypms-back-end.vercel.app/api/past-groups');
        setPastGroups(response.data.data); // Assuming response follows the structure { success: true, data: [...] }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching past group records:', error);
        toast.error('Failed to fetch past group records.');
        setLoading(false);
      }
    };

    fetchPastGroups();
  }, []);

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        // await axios.delete(`http://localhost:5000/api/past-groups/${groupId}`);
        await axios.delete(`https://fypms-back-end.vercel.app/api/past-groups/${groupId}`);
        // Remove the deleted group from the state
        setPastGroups(pastGroups.filter(group => group._id !== groupId));
        toast.success("Group deleted successfully!");
      } catch (error) {
        console.error('Error deleting group:', error);
        toast.error('Failed to delete the group.');
      }
    }
  };

  // Filter past groups based on user role
  let filteredGroups = [];
  if (loggedInUserRole === "Committee") {
    // Show all groups for Committee role
    filteredGroups = pastGroups;
  } else if (loggedInUserRole === "Supervisor") {
    // Show only groups supervised by the logged-in supervisor
    filteredGroups = pastGroups.filter(group => group.supervisor.username === loggedInUser);
  }

  // Group projects by year based on the filtered results
  const groupedByYear = filteredGroups.reduce((acc, group) => {
    const year = new Date(group.registeredAt).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(group);
    return acc;
  }, {});

  if (loading) {

    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-left text-3xl md:text-[40px] font-BebasNeueSemiExpBold mb-6">Record of Projects</h2>
      {Object.keys(groupedByYear).length === 0 ? (
        <p className="text-center text-gray-500">No past groups available.</p>
      ) : (
        Object.keys(groupedByYear).sort((a, b) => b - a).map((year) => (
          <div key={year} className="mb-10">
            <h3 className="text-4xl font-semibold font-BebasNeueSemiExpBold underline text-blue-600 mb-4">{year - 4} - {year}</h3>
            <div className="overflow-x-scroll sm:overflow-auto">
            <table className="w-max sm:w-full table-auto rounded ">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="px-4 py-2">Project Title</th>
                    <th className="px-4 py-2">Supervisor</th>
                    <th className="px-4 py-2">Members</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedByYear[year].map((group) => (
                    <tr key={group._id} className="border-b">
                      <td className="px-4 py-2 text-left font-medium">{group.projectTitle}</td>
                      <td className="px-4 py-2 text-left">{group.supervisor.name}</td>
                      <td className="px-4 py-2 text-left">
                        <ul>
                          {group.members.map((member) => (
                            <li key={member._id} className="">
                              {/* <span>{member.name}</span> */}
                              <span>{member.username}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-2 text-left">
                        <button
                          onClick={() => handleDeleteGroup(group._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
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
};

export default PastProjectsRecords;

