import React, { useState, useEffect } from "react";
import "./Styles/StudentList.css";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';


const SupervisorsList = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    try {
      // const response = await axios.get('http://localhost:5000/api/supervisors');
      const response = await axios.get('https://fypms-back-end.vercel.app/api/supervisors');
      setSupervisors(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching supervisors:', error);
      toast.error('Error fetching supervisors:', error);
      // Handle error (e.g., display error message)
    }
  };

  return (
    <div className="student-list">
      <h1 className="text-left text-3xl md:text-[40px] font-BebasNeueSemiExpBold mb-6">Registered Supervisors</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='mt-10'>
          <div>
            <table className="w-full table-auto rounded mt-5">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 w-1/2 text-left">Name</th>
                  <th className="px-4 py-2 w-1/2 text-left">ID</th>
                </tr>
              </thead>
              <tbody>
                {supervisors.map((supervisor, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2 w-1/2">{supervisor.name}</td>
                    <td className="px-4 py-2 w-1/2">{supervisor.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default SupervisorsList;
