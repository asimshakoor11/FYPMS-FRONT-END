import React, { useState, useEffect } from "react";
import "./Styles/StudentList.css";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, [])

  const fetchStudents = async () => {
    try {
      // const response = await axios.get('http://localhost:5000/api/students');
      const response = await axios.get('https://fypms-back-end.vercel.app/api/students');
      const sortedStudents = sortStudentsByRollNumber(response.data);
      setLoading(false);
      setStudents(sortedStudents);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching students:', error);
      toast.error('Error fetching students:', error);
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

  return (
    <div className="student-list">
      <h1 className='font-bold text-3xl'>Registered Students</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='mt-10'>
          <div className="overflow-x-scroll sm:overflow-auto">
              <table className="w-max sm:w-full table-auto rounded mt-5">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Roll No</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{student.name}</td>
                    <td className="px-4 py-2">{student.username}</td>
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
}

export default StudentList;
