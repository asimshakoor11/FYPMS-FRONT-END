import React, { useState } from "react";
import "./Styles/LoginForm.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleRoleChange = (event) => setRole(event.target.value);

  const handleSubmit = async () => {
    // Check if the user exists in local storage

    if (username === "" || password === "" || role === "") {
      toast.error("Fill the credientials")
    }
    else {

      if (role === "Student") {
        try {
          const response = await axios.post('http://localhost:5000/api/students/login', {
            // const response = await axios.post('https://fypms-back-end.vercel.app/api/students/login', {
            username,
            password,
          });

          // Assuming your backend sends back username and role upon successful login

          // Example of what to do after successful login
          toast.success(`Logged in ${response.data.message}: ${response.data.username}`);
          // You can redirect or update state to indicate successful login
          localStorage.setItem("loggedInUser", response.data.username);
          localStorage.setItem("loggedInUserName", response.data.name);
          localStorage.setItem("userRole", response.data.role);
          localStorage.setItem('token', response.data.token);

          navigate("/StudentDashboard");

        } catch (error) {
          console.error('Login error:', error);
          toast.error('Login failed. Please check your credentials.');
          // Handle login error (e.g., display error message)
        }
      }
      else if (role === "Supervisor") {
        try {
          const response = await axios.post('http://localhost:5000/api/supervisors/login', {
            // const response = await axios.post('https://fypms-back-end.vercel.app/api/supervisors/login', {
            username,
            password,
          });

          // Example of what to do after successful login
          toast.success(`Logged in ${response.data.message}: ${response.data.username}`);
          // You can redirect or update state to indicate successful login
          localStorage.setItem("loggedInUser", response.data.username);
          localStorage.setItem("loggedInUserName", response.data.name);
          localStorage.setItem("userRole", response.data.role);
          localStorage.setItem('token', response.data.token);
          navigate("/SuperDashboard");

        } catch (error) {
          console.error('Login error:', error);
          toast.error('Login failed. Please check your credentials.');
          // Handle login error (e.g., display error message)
        }

      }
      else if (role === "Committee") {
        try {
          const response = await axios.post('http://localhost:5000/api/authCommittee/login', {
            // const response = await axios.post('https://fypms-back-end.vercel.app/api/authCommittee/login', {
            username,
            password,
          });
          localStorage.setItem('token', response.data.token);
          toast.success('Login successful');
          localStorage.setItem("loggedInUser", username);
          localStorage.setItem("loggedInUserName", "Fyp Committee");
          localStorage.setItem("userRole", role);
          navigate("/CommitteeDashboard");
        } catch (error) {
          toast.error(error.response.data.message || 'Login failed.');
        }
      }
    }
  };

  const handleRegister = async () => {
    // this registration is only for committee
    if (username === "" || password === "" || role === "") {
      toast.success("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/authCommittee/register', {
        // const response = await axios.post('https://fypms-back-end.vercel.app/api/authCommittee/register', {
        username,
        password,
        role,
      });
      toast.success(response.data.message);
      setUsername('');
      setPassword('');
      setRole('');
    } catch (error) {
      toast.error(error.response.data.message || 'Registration failed.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen" style={{ backgroundImage: 'url(/images/background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <form className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">FYP Management System</h1>
        <label className="block mb-2">Username:</label>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">Password:</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">Select Role:</label>
        <select
          value={role}
          onChange={handleRoleChange}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">Select</option>
          <option value="Student">Student</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Committee">Committee</option>
        </select>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full p-2 bg-primarycolor text-white rounded hover:bg-primarycolorhover"
        >
          Login
        </button>
        <button
          type="button"
          onClick={handleRegister}
          className="w-full p-2 mt-4 bg-primarycolor text-white rounded hover:bg-primarycolorhover"
        >
          Register
        </button>
      </form>
      <Toaster />
    </div>

  );
}

export default LoginForm;
