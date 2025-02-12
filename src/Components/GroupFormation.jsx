import React, { useState, useEffect } from "react";
import "./Styles/StudentList.css";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const GroupFormation = () => {
    const [groupNumber, setGroupNumber] = useState("");
    const [groupNumberPlace, setGroupNumberPlace] = useState("");
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedSupervisor, setSelectedSupervisor] = useState("");
    const [projectTitle, setProjectTitle] = useState("");
    const [students, setStudents] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch students from the backend
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // const response = await axios.get('http://localhost:5000/api/students');
                const response = await axios.get('https://fypms-back-end.vercel.app/api/students');
                setStudents(response.data);
                setLoading(false);

            } catch (error) {
                console.error('Error fetching students:', error);
                setLoading(false);

            }
        };
        fetchStudents();
    }, []);

    // Fetch supervisors from the backend
    useEffect(() => {
        const fetchSupervisors = async () => {
            try {
                // const response = await axios.get('http://localhost:5000/api/supervisors');
                const response = await axios.get('https://fypms-back-end.vercel.app/api/supervisors');
                setSupervisors(response.data);
                setLoading(false);

            } catch (error) {
                console.error('Error fetching supervisors:', error);
                setLoading(false);

            }
        };
        fetchSupervisors();
    }, []);

    // Fetch groups from the backend
    useEffect(() => {
        fetchGroups();
        if (groups.length > 0) {
            setGroupNumberPlace(groups.length + 1)
        }
    }, [groups]);

    const fetchGroups = async () => {
        try {
            // const response = await axios.get('http://localhost:5000/api/groups');
            const response = await axios.get('https://fypms-back-end.vercel.app/api/groups');
            const sortedGroups = response.data.sort((a, b) => a.number - b.number);
            setGroups(sortedGroups);
            setLoading(false);

        } catch (error) {
            console.error('Error fetching groups:', error);
            toast.error("Error fetching groups");
            setLoading(false);
        }
    };

    const handleAddToGroup = async () => {
        if (selectedStudents.length > 0 && selectedSupervisor && groupNumber && projectTitle) {
            // Check if the selected group already exists
            const existingGroup = groups.find(group => group.number === groupNumber);

            // Calculate the total number of members including selected ones
            const totalMembers = existingGroup ? existingGroup.members.length + selectedStudents.length : selectedStudents.length;

            // Check if adding more students exceeds the maximum limit of 4
            if (totalMembers > 4) {
                toast.error("Cannot add more than 4 members to a group.");
                return;
            }

            try {
                if (existingGroup) {
                    // Update existing group with new members
                    // const response = await axios.put(`http://localhost:5000/api/groups/${existingGroup._id}`, {
                    const response = await axios.put(`https://fypms-back-end.vercel.app/api/groups/${existingGroup._id}`, {
                        members: [...existingGroup.members.map(member => member._id), ...selectedStudents],
                    });
                    const updatedGroup = response.data;
                    const updatedGroups = groups.map(group =>
                        group._id === updatedGroup._id ? updatedGroup : group
                    );
                    setGroups(updatedGroups);
                    fetchGroups();

                } else {
                    // Create a new group
                    // const response = await axios.post('http://localhost:5000/api/groups', {
                    const response = await axios.post('https://fypms-back-end.vercel.app/api/groups', {
                        number: groupNumber,
                        members: selectedStudents,
                        supervisor: selectedSupervisor,
                        projectTitle: projectTitle,
                    });
                    const newGroup = response.data;
                    setGroups([...groups, newGroup]);
                    fetchGroups();
                }

                // Store past group record
                await axios.post('http://localhost:5000/api/past-projects', {
                    groupNumber: groupNumber,
                    members: selectedStudents,
                    supervisor: selectedSupervisor,
                    projectTitle: projectTitle,
                });

                // Reset form fields
                toast.success('Group Registered Successfully');

                setGroupNumber("");
                setSelectedStudents([]);
                setSelectedSupervisor("");
                setProjectTitle("");
            } catch (error) {
                console.error('Error creating or updating group:', error);
                toast.error('Error creating or updating group. Please try again.');
            }
        } else {
            toast.error("Please select students, a supervisor, and enter a group number and project title.");
        }
    };

    const handleRemoveFromGroup = async (groupId, memberId) => {
        try {
            // await axios.delete(`http://localhost:5000/api/groups/${groupId}/member/${memberId}`);
            await axios.delete(`https://fypms-back-end.vercel.app/api/groups/${groupId}/member/${memberId}`);
            const updatedGroups = groups.map((group) => {
                if (group._id === groupId) {
                    group.members = group.members.filter((member) => member._id !== memberId);
                }
                return group;
            });
            setGroups(updatedGroups);
            fetchGroups();

        } catch (error) {
            console.error('Error removing member from group:', error);
            toast.error('Error removing member from group. Please try again.');
        }
    };

    const handleDeleteGroup = async (groupId) => {
        try {
            // await axios.delete(`http://localhost:5000/api/groups/${groupId}`);
            await axios.delete(`https://fypms-back-end.vercel.app/api/groups/${groupId}`);
            const updatedGroups = groups.filter((group) => group._id !== groupId);
            setGroups(updatedGroups);
            fetchGroups();

        } catch (error) {
            console.error('Error deleting group:', error);
            toast.error('Error deleting group. Please try again.');
        }
    };

    const handleGroupNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setGroupNumber(value);
        }
    };

    const availableStudents = students.filter(
        (student) =>
            !groups.some((group) =>
                group.members.some((member) => member._id === student._id)
            )
    );

    if (loading) return <div className="container"><p>Loading...</p></div>;


    return (
        <div className="container">
            <h3 className="text-left text-3xl md:text-[40px] font-BebasNeueSemiExpBold mb-6">Add Students to Group</h3>
            <div className="mt-10">

                <label htmlFor="Select Students" className="font-semibold">Select Students</label>
                <select
                    multiple
                    id="Select Students"
                    className="custom-select mb-5 mt-2"
                    value={selectedStudents}
                    onChange={(e) => setSelectedStudents(Array.from(e.target.selectedOptions, option => option.value))}
                >
                    {
                        availableStudents.map((student) => (
                            <option key={student._id} value={student._id}>
                                {student.name} ({student.username})
                            </option>
                        ))}
                </select>
                <label htmlFor="selectsupervisor" className="font-semibold">Select Supervisor</label>

                <select
                    id="selectsupervisor"
                    value={selectedSupervisor}
                    onChange={(e) => setSelectedSupervisor(e.target.value)}
                    className="w-full mt-2 border-2 border-gray-300 p-3 rounded "
                >
                    <option value="" disabled>
                        Select Supervisor
                    </option>
                    {supervisors.map((supervisor) => (
                        <option key={supervisor._id} value={supervisor._id}>
                            {supervisor.name} ({supervisor.username})
                        </option>
                    ))}
                </select>

                <div className="w-full flex flex-col sm:flex-row gap-5 mt-5">
                    <div className="w-full sm:w-1/2">
                        <label htmlFor="Group Number" className="font-semibold">Group Number</label>

                        <input
                            className="w-full p-3 mt-2"
                            type="text"
                            placeholder={`${groupNumberPlace}`}
                            value={groupNumber}
                            onChange={handleGroupNumberChange}
                            required
                        />
                    </div>

                    <div className="w-full sm:w-1/2">
                        <label htmlFor="Project Title" className="font-semibold">Project Title</label>

                        <input
                            className="w-full p-3 mt-2"
                            type="text"
                            placeholder="Project Title"
                            value={projectTitle}
                            onChange={(e) => setProjectTitle(e.target.value)}
                            required
                        />
                    </div>

                </div>

                <button onClick={handleAddToGroup} className="p-3 bg-[#007bff] hover:bg-[#0056b3] text-white mt-5">Add to Group</button>
            </div>


            <div className="group-list mt-10">
                <h2 className="text-left text-3xl md:text-[40px] font-BebasNeueSemiExpBold mb-6">Registered Groups</h2>
                {groups.map((group, index) => (
                    <div key={index} className="mt-10 flex flex-col gap-4">
                        <h3 className="font-semibold font-BebasNeueSemiExpBold text-4xl underline">Group {group.number}</h3>
                        <p><strong>Supervisor:</strong> {group.supervisor.name} ({group.supervisor.username})</p>
                        <p><strong>Project Title:</strong> {group.projectTitle}</p>
                        <h3 className="font-semibold text-xl">Members</h3>
                        <div className="overflow-x-scroll sm:overflow-auto">
                            <table className="w-max sm:w-full table-auto rounded ">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="px-4 py-2 text-left w-1/3">Name</th>
                                        <th className="px-4 py-2 text-left w-1/3">Roll Number</th>
                                        <th className="px-4 py-2 text-left w-1/3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {group.members.map((student) => (
                                        <tr key={student._id} className="border-b">
                                            <td className="px-4 py-2">{student.name}</td>
                                            <td className="px-4 py-2">{student.username}</td>
                                            <td className="px-4 py-2">
                                                <button
                                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                                                    onClick={() => handleRemoveFromGroup(group._id, student._id)}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4 w-full">
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                                    onClick={() => handleDeleteGroup(group._id)}
                                >
                                    Delete Group
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
            <Toaster />
        </div>
    );
};

export default GroupFormation;
