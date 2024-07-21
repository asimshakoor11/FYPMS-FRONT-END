import React, { useState } from "react";
import "./Styles/LoginForm.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

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
      alert("Fill the credientials")
    }
    else {

      if (role === "Student") {
        try {
          // const response = await axios.post('http://localhost:5000/api/students/login', {
            const response = await axios.post('https://fypms-back-end.vercel.app/api/students/login', {
            username,
            password,
          });

          // Assuming your backend sends back username and role upon successful login
          
          // Example of what to do after successful login
          alert(`Logged in ${response.data.message}: ${response.data.username}`);
          // You can redirect or update state to indicate successful login
          localStorage.setItem("loggedInUser", response.data.username);
          localStorage.setItem("loggedInUserName", response.data.name);
          localStorage.setItem("userRole", response.data.role);
          localStorage.setItem('token', response.data.token);

          navigate("/StudentDashboard");

        } catch (error) {
          console.error('Login error:', error);
          alert('Login failed. Please check your credentials.');
          // Handle login error (e.g., display error message)
        }
      }
      else if (role === "Supervisor") {
        try {
          // const response = await axios.post('http://localhost:5000/api/supervisors/login', {
            const response = await axios.post('https://fypms-back-end.vercel.app/api/supervisors/login', {
            username,
            password,
          });
          
          // Example of what to do after successful login
          alert(`Logged in ${response.data.message}: ${response.data.username}`);
          // You can redirect or update state to indicate successful login
          localStorage.setItem("loggedInUser", response.data.username);
          localStorage.setItem("loggedInUserName", response.data.name);
          localStorage.setItem("userRole", response.data.role);
          localStorage.setItem('token', response.data.token);
          navigate("/SuperDashboard");

        } catch (error) {
          console.error('Login error:', error);
          alert('Login failed. Please check your credentials.');
          // Handle login error (e.g., display error message)
        }

      }
      else if (role === "Committee") {
        try {
          // const response = await axios.post('http://localhost:5000/api/authCommittee/login', {
            const response = await axios.post('https://fypms-back-end.vercel.app/api/authCommittee/login', {
            username,
            password,
          });
          localStorage.setItem('token', response.data.token);
          alert('Login successful');
          localStorage.setItem("loggedInUser", username);
          localStorage.setItem("loggedInUserName", "Fyp Committee");
          localStorage.setItem("userRole", role);
          navigate("/CommitteeDashboard");
        } catch (error) {
          alert(error.response.data.message || 'Login failed.');
        }
      }
    }
  };

  const handleRegister = async () => {
    // this registration is only for committee
    if (username === "" || password === "" || role === "") {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // const response = await axios.post('http://localhost:5000/api/authCommittee/register', {
        const response = await axios.post('https://fypms-back-end.vercel.app/api/authCommittee/register', {
        username,
        password,
        role,
      });
      alert(response.data.message);
      setUsername('');
      setPassword('');
      setRole('');
    } catch (error) {
      alert(error.response.data.message || 'Registration failed.');
    }
  };

  return (
    <div>
      <form className="login-form">
        <h1>FYP Management System</h1>
        <label>Username:</label>
        <input type="text" value={username} onChange={handleUsernameChange} />
        <label>Password:</label>
        <input type="password" value={password} onChange={handlePasswordChange} />
        <label>Select Role:</label>
        <select value={role} onChange={handleRoleChange}>
          <option value="">Select</option>
          <option value="Student">Student</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Committee">Committee</option>
        </select>
        <button type="button" onClick={handleSubmit}>
          Login
        </button>
       {/* <button type="button" onClick={handleRegister}>
          Register
        </button> */}
      </form>
    </div>
  );
}

export default LoginForm;
