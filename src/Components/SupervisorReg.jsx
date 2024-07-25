import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./Styles/SupervisorReg.css";
import toast, { Toaster } from 'react-hot-toast';

function SupervisorReg() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [supervisors, setSupervisors] = useState([]);

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    try {
      // const response = await axios.get('http://localhost:5000/api/supervisors');
      const response = await axios.get('https://fypms-back-end.vercel.app/api/supervisors');
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
        toast.success('Supervisor registered successfully');
        setName("");
        setId("");
        fetchSupervisors(); // Refresh supervisor list after registration
      } catch (error) {
        console.error('Supervisor registration error:', error);
        toast.error('Supervisor registration error:', error);

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
    <div className="container">
      <h1 className='font-bold text-3xl'>Register Student</h1>

      <div className="mt-10 flex flex-col">
        <div className='flex gap-5'>
          <div className='w-1/2'>
            <input
              type="text"
              placeholder="Name"
              value={name}
              className='p-3'

              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='w-1/2'>

            <input
              type="text"
              placeholder="ID"
              className='p-3'

              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>


        </div>
        <div className='w-full mt-5'>
          <button onClick={handleAddSupervisor} className="p-3 bg-[#007bff] hover:bg-[#0056b3] text-white">Add Supervisor</button>
        </div>
      </div>
      {/* <ul className="supervisor-list">
        {supervisors.map((supervisor, index) => (
          <li className="list-item" key={index}>
            <p>
              <b>Name:</b> {supervisor.name} <br />
              <b>ID:</b> {supervisor.username}
            </p>
            <button onClick={() => handleDeleteSupervisor(supervisor.username)}>Delete</button>
          </li>
        ))}
      </ul> */}
      <div className='mt-10'>
        <h1 className='font-bold text-3xl'>Supervisor List</h1>

        <div>
          <table className="w-full table-auto rounded mt-5">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left w-1/3">Name</th>
                <th className="px-4 py-2 text-left w-1/3">ID</th>
                <th className="px-4 py-2 text-left w-1/3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {supervisors.map((supervisor, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 w-1/3">{supervisor.name}</td>
                  <td className="px-4 py-2 w-1/3">{supervisor.username}</td>
                  <td className="px-4 py-2 w-1/3">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDeleteSupervisor(supervisor.username)}
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
      <Toaster />
    </div>
  );
}

export default SupervisorReg;
