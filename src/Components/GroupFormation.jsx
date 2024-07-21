import React, { useState, useEffect } from "react";
import "./Styles/StudentList.css";
import axios from 'axios';

const GroupFormation = () => {
    const [groupNumber, setGroupNumber] = useState("");
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedSupervisor, setSelectedSupervisor] = useState("");
    const [projectTitle, setProjectTitle] = useState("");
    const [students, setStudents] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [groups, setGroups] = useState([]);

    // Fetch students from the backend
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // const response = await axios.get('http://localhost:5000/api/students');
                const response = await axios.get('https://fypms-back-end.vercel.app/api/students');
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching students:', error);
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
            } catch (error) {
                console.error('Error fetching supervisors:', error);
            }
        };
        fetchSupervisors();
    }, []);

    // Fetch groups from the backend
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                // const response = await axios.get('http://localhost:5000/api/groups');
                const response = await axios.get('https://fypms-back-end.vercel.app/api/groups');
                setGroups(response.data);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };
        fetchGroups();
    }, []);

    

    const handleAddToGroup = async () => {
        if (selectedStudents.length > 0 && selectedSupervisor && groupNumber && projectTitle) {
            // Check if the selected group already exists
            const existingGroup = groups.find(group => group.number === groupNumber);

            // Calculate the total number of members including selected ones
            const totalMembers = existingGroup ? existingGroup.members.length + selectedStudents.length : selectedStudents.length;

            // Check if adding more students exceeds the maximum limit of 4
            if (totalMembers > 4) {
                alert("Cannot add more than 4 members to a group.");
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
                }

                // Reset form fields
                setGroupNumber("");
                setSelectedStudents([]);
                setSelectedSupervisor("");
                setProjectTitle("");
            } catch (error) {
                console.error('Error creating or updating group:', error);
                alert('Error creating or updating group. Please try again.');
            }
        } else {
            alert("Please select students, a supervisor, and enter a group number and project title.");
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
        } catch (error) {
            console.error('Error removing member from group:', error);
            alert('Error removing member from group. Please try again.');
        }
    };


    const handleDeleteGroup = async (groupId) => {
        try {
            // await axios.delete(`http://localhost:5000/api/groups/${groupId}`);
            await axios.delete(`https://fypms-back-end.vercel.app/api/groups/${groupId}`);
            const updatedGroups = groups.filter((group) => group._id !== groupId);
            setGroups(updatedGroups);
        } catch (error) {
            console.error('Error deleting group:', error);
            alert('Error deleting group. Please try again.');
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

    return (
        <div>
            <h3>Add Students to Group</h3>
            <select
                multiple
                className="custom-select"
                value={selectedStudents}
                onChange={(e) => setSelectedStudents(Array.from(e.target.selectedOptions, option => option.value))}
            >
                {availableStudents.map((student) => (
                    <option key={student._id} value={student._id}>
                        {student.name} ({student.username})
                    </option>
                ))}
            </select>
            <select
                value={selectedSupervisor}
                onChange={(e) => setSelectedSupervisor(e.target.value)}
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
            <input
                type="text"
                placeholder="Group Number"
                value={groupNumber}
                onChange={handleGroupNumberChange}
                required
            />
            <input
                type="text"
                placeholder="Project Title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                required
            />
            <button onClick={handleAddToGroup}>Add to Group</button>

            <div className="group-list">
                <h2>Group List</h2>
                {groups.map((group, index) => (
                    <div key={index}>
                        <h3>Group {group.number}</h3>
                        <p><strong>Supervisor:</strong> {group.supervisor.name} ({group.supervisor.username})</p>
                        <p><strong>Project Title:</strong> {group.projectTitle}</p>
                        <ul>
                            {group.members.map((student) => (
                                <li key={student._id}>
                                    {student.name} ({student.username})
                                    <button
                                        onClick={() =>
                                            handleRemoveFromGroup(group._id, student._id)
                                        }
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => handleDeleteGroup(group._id)}>
                            Delete Group
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupFormation;
