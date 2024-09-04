import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function StudentReg() {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('FA20-BSE-');
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const handleAddStudent = async () => {
    if (name && rollNumber) {
      try {
        // await axios.post('http://localhost:5000/api/students/register', {
        await axios.post('https://fypms-back-end.vercel.app/api/students/register', {
          name,
          username: rollNumber,
          password: 'student@123', // Default password
        });
        toast.success('Student registered successfully');
        setName('');
        setRollNumber('FA20-BSE-');
        setError('');
        fetchStudents(); // Optional: Refresh student list after registration
      } catch (error) {
        setError(error.response.data.message || 'Registration failed.');
        toast.error(error.response.data.message || 'Registration failed.')

      }
    } else {
      toast.error('Please fill in all fields.');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [])

  const fetchStudents = async () => {
    try {
      // const response = await axios.get('http://localhost:5000/api/students');
      const response = await axios.get('https://fypms-back-end.vercel.app/api/students');
      const sortedStudents = sortStudentsByRollNumber(response.data);
      setStudents(sortedStudents);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching students:', error);
      toast.error('Registration failed.')

    }
  };

  // Function to extract numeric part and sort
  const sortStudentsByRollNumber = (students) => {
    return students.sort((a, b) => {
      const rollNumberA = parseInt(a.username.split('-').pop(), 10);
      const rollNumberB = parseInt(b.username.split('-').pop(), 10);
      return rollNumberA - rollNumberB;
    });
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
    <div className="container">
      <h1 className='font-bold text-3xl'>Register Student</h1>
      <div className="mt-10 flex flex-col">
        <div className='flex flex-col sm:flex-row gap-5'>
          <div className='w-full sm:w-1/2'>
            <input
              type="text"
              placeholder="Name"
              value={name}
              className='p-3'
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='w-full sm:w-1/2'>

            <input
              type="text"
              placeholder="Roll Number"
              value={rollNumber}
              className='p-3'
              onChange={(e) => {
                setRollNumber(e.target.value);
                setError('');
              }}
            />
          </div>

        </div>
        <div className='w-full mt-5'>
          <button onClick={handleAddStudent} className='p-3 bg-[#007bff] hover:bg-[#0056b3] text-white'>Add Student</button>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className='mt-10'>
        <h1 className='font-bold text-3xl'>Student List</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-scroll sm:overflow-auto">
              <table className="w-max sm:w-full  table-auto rounded mt-5">
              <thead>
                <tr className="bg-gray-200">
                  <th className="min-w-max px-4 py-2 text-left">Name</th>
                  <th className="min-w-max px-4 py-2 text-left">Roll No</th>
                  <th className="min-w-max px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index} className="border-b">
                    <td className="min-w-max px-4 py-2">{student.name}</td>
                    <td className="min-w-max px-4 py-2">{student.username}</td>
                    <td className="min-w-max px-4 py-2">
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                        onClick={() => handleDeleteStudent(student.username)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Toaster />


    </div>
  );
}

export default StudentReg;
