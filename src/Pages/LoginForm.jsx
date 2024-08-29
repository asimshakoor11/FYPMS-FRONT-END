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
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          // const response = await axios.post('http://localhost:5000/api/students/login', {
          const response = await axios.post('https://fypms-back-end.vercel.app/api/students/login', {
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
          // const response = await axios.post('http://localhost:5000/api/supervisors/login', {
          const response = await axios.post('https://fypms-back-end.vercel.app/api/supervisors/login', {
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
          // const response = await axios.post('http://localhost:5000/api/authCommittee/login', {
          const response = await axios.post('https://fypms-back-end.vercel.app/api/authCommittee/login', {
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
      // const response = await axios.post('http://localhost:5000/api/authCommittee/register', {
      const response = await axios.post('https://fypms-back-end.vercel.app/api/authCommittee/register', {
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
        {/* <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          className="w-full p-2 mb-4 border rounded"
        /> */}
        <div className="relative w-full ">
          <input
            type={showPassword ? "text" : "password"} // Toggle input type based on state
            value={password}
            onChange={handlePasswordChange}
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="w-fit absolute right-2 top-2 p-1 border border-transparent bg-transparent hover:bg-transparent"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                height="20"
                x="0"
                y="0"
                viewBox="0 0 24 24"
                style={{ enableBackground: "new 0 0 512 512" }} // Converted style attribute to an object
                xmlSpace="preserve"
              >
                <g>
                  <path
                    d="M23.271 9.419A15.866 15.866 0 0 0 19.9 5.51l2.8-2.8a1 1 0 0 0-1.414-1.414l-3.045 3.049A12.054 12.054 0 0 0 12 2.655c-6.191 0-9.719 4.238-11.271 6.764a4.908 4.908 0 0 0 0 5.162A15.866 15.866 0 0 0 4.1 18.49l-2.8 2.8a1 1 0 1 0 1.414 1.414l3.052-3.052A12.054 12.054 0 0 0 12 21.345c6.191 0 9.719-4.238 11.271-6.764a4.908 4.908 0 0 0 0-5.162ZM2.433 13.534a2.918 2.918 0 0 1 0-3.068C3.767 8.3 6.782 4.655 12 4.655a10.1 10.1 0 0 1 4.766 1.165l-2.013 2.013a4.992 4.992 0 0 0-6.92 6.92l-2.31 2.31a13.723 13.723 0 0 1-3.09-3.529ZM15 12a3 3 0 0 1-3 3 2.951 2.951 0 0 1-1.285-.3l3.985-3.985A2.951 2.951 0 0 1 15 12Zm-6 0a3 3 0 0 1 3-3 2.951 2.951 0 0 1 1.285.3L9.3 13.285A2.951 2.951 0 0 1 9 12Zm12.567 1.534C20.233 15.7 17.218 19.345 12 19.345a10.1 10.1 0 0 1-4.766-1.165l2.013-2.013a4.992 4.992 0 0 0 6.92-6.92l2.31-2.31a13.723 13.723 0 0 1 3.09 3.529 2.918 2.918 0 0 1 0 3.068Z"
                    fill="#000000"
                    opacity="1"
                    data-original="#000000"
                  ></path>
                </g>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                height="20"
                x="0"
                y="0"
                viewBox="0 0 24 24"
                style={{ enableBackground: "new 0 0 512 512" }} // Converted style attribute to an object
                xmlSpace="preserve"
              >
                <g>
                  <path
                    d="M23.271 9.419C21.72 6.893 18.192 2.655 12 2.655S2.28 6.893.729 9.419a4.908 4.908 0 0 0 0 5.162C2.28 17.107 5.808 21.345 12 21.345s9.72-4.238 11.271-6.764a4.908 4.908 0 0 0 0-5.162Zm-1.705 4.115C20.234 15.7 17.219 19.345 12 19.345S3.766 15.7 2.434 13.534a2.918 2.918 0 0 1 0-3.068C3.766 8.3 6.781 4.655 12 4.655s8.234 3.641 9.566 5.811a2.918 2.918 0 0 1 0 3.068Z"
                    fill="#000000"
                    opacity="1"
                    data-original="#000000"
                  ></path>
                  <path
                    d="M12 7a5 5 0 1 0 5 5 5.006 5.006 0 0 0-5-5Zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3Z"
                    fill="#000000"
                    opacity="1"
                    data-original="#000000"
                  ></path>
                </g>
              </svg>
            )}

          </button>
        </div>
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
        {/* <button
          type="button"
          onClick={handleRegister}
          className="w-full p-2 mt-4 bg-primarycolor text-white rounded hover:bg-primarycolorhover"
        >
          Register
        </button> */}
      </form>
      <Toaster />
    </div>

  );
}

export default LoginForm;
