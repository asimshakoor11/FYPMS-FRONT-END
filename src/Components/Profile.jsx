import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Styles/Profile.css";
import toast, { Toaster } from 'react-hot-toast';

function Profile() {

  const username = localStorage.getItem("loggedInUser");
  const Role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [showPassword2, setShowPassword2] = useState(false);

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };


  const [user, setUser] = useState({
    username: username,
    name: "",
    address: "",
    email: "",
    phone: "",
    photo: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isEditPassword, setIsEditPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (username) {
      // axios.get(`http://localhost:5000/api/profile/${username}`, {
      axios.get(`https://fypms-back-end.vercel.app/api/profile/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          if (response.data) {
            setUser(response.data);
            if (response.data.photo) {
              // setImagePreview(`http://localhost:5000${response.data.photo}`);
              setImagePreview(`${response.data.photo}`);
            }
          }
        })
        .catch(error => {
          console.error("There was an error fetching the profile!", error);
        });
    }
  }, [username, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setUser(prevUser => ({ ...prevUser, photo: file }));
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    Object.keys(user).forEach(key => {
      formData.append(key, user[key]);
    });

    // axios.post(`http://localhost:5000/api/profile/${username}`, formData, {
    axios.post(`https://fypms-back-end.vercel.app/api/profile/${username}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setUser(response.data);
        if (response.data.photo) {
          setImagePreview(`http://localhost:5000${response.data.photo}`);
          // setImagePreview(`https://fypms-back-end.vercel.app${response.data.photo}`);
        }
        toast.success("Profile updated successfully");
        setIsEditing(false);
      })
      .catch(error => {
        toast.error("There was an error updating the profile!", error);
      });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleEditPassword = () => {
    setIsEditPassword(true);
  };

  const handleUpdatePass = async () => {

    if (!oldPassword || !newPassword) {
      toast.error("Enter Details")
    }
    else {
      if (Role === "Committee") {
        try {
          const token = localStorage.getItem('token'); // Retrieve token from local storage
          const response = await axios.post(
            // 'http://localhost:5000/api/authCommittee/change-password',
            'https://fypms-back-end.vercel.app/api/authCommittee/change-password',
            { username, oldPassword, newPassword },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success(response.data.message);
          setIsEditPassword(false);

        } catch (error) {
          console.error('Error updating password:', error);
          toast.error(error.response.data.message || 'Error updating password');
        }
      }

      else if (Role === "Student") {
        try {
          const token = localStorage.getItem('token'); // Retrieve token from local storage
          const response = await axios.post(
            // 'http://localhost:5000/api/students/change-password',
            'https://fypms-back-end.vercel.app/api/students/change-password',
            { username, oldPassword, newPassword },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success(response.data.message);
          setIsEditPassword(false);

        } catch (error) {
          console.error('Error updating password:', error);
          toast.error(error.response.data.message || 'Error updating password');
        }
      }
      else if (Role === "Supervisor") {
        try {
          const token = localStorage.getItem('token'); // Retrieve token from local storage
          const response = await axios.post(
            // 'http://localhost:5000/api/supervisors/change-password',
            'https://fypms-back-end.vercel.app/api/supervisors/change-password',
            { username, oldPassword, newPassword },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success(response.data.message);
          setIsEditPassword(false);

        } catch (error) {
          console.error('Error updating password:', error);
          toast.error(error.response.data.message || 'Error updating password');
        }
      }
    }
  }

  return (

    <div className="container mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-sm">
      <h1 className="text-center text-2xl font-bold mb-6">Profile</h1>
      <div className="grid gap-6 justify-items-center">
        <div className="flex justify-center">
          {imagePreview && <img src={imagePreview} alt="Profile Preview" className="w-36 h-36 rounded-full object-cover mb-6" />}
        </div>
        <div className="w-full">
          {isEditing ? (
            <>
              <div className="grid gap-4 mb-4 text-base">
                <label className="font-semibold">Name:</label>
                <input type="text" name="name" value={user.name} onChange={handleInputChange} className="border rounded-lg p-2" />
                <label className="font-semibold">Address:</label>
                <input type="text" name="address" value={user.address} onChange={handleInputChange} className="border rounded-lg p-2" />
                <label className="font-semibold">Email:</label>
                <input type="email" name="email" value={user.email} onChange={handleInputChange} className="border rounded-lg p-2" />
                <label className="font-semibold">Phone Number:</label>
                <input type="tel" name="phone" value={user.phone} onChange={handleInputChange} className="border rounded-lg p-2" />
                <label className="font-semibold">Photo:</label>
                <input type="file" name="photo" onChange={handlePhotoChange} className="border rounded-lg p-2" />
              </div>
              <button onClick={handleSave} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                Save Profile
              </button>
            </>
          ) : (
            <>
              <div className="grid gap-2 mb-4 text-base">
                <div className="flex flex-row gap-4">
                  <label className="font-semibold text-base">Name:</label>
                  <p>{user.name}</p>
                </div>
                <div className="flex flex-row gap-4">
                  <label className="font-semibold">Address:</label>
                  <p>{user.address}</p>
                </div>
                <div className="flex flex-row gap-4">
                  <label className="font-semibold">Email:</label>
                  <p>{user.email}</p>
                </div>
                <div className="flex flex-row gap-4">
                  <label className="font-semibold">Phone Number:</label>
                  <p>{user.phone}</p>
                </div>
              </div>
              <button onClick={handleEdit} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                Edit Profile
              </button>
            </>
          )}
        </div>
        <div className="w-full">
          {isEditPassword ? (
            <>
              <div className="grid gap-4 mb-4">
                <label className="font-semibold">Old Password:</label>
                <div className="relative w-full">
                  <input type={showPassword ? "text" : "password"} name="oldPassword" value={oldPassword} onChange={handleOldPasswordChange} className="border rounded-lg p-2" />
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
                <label className="font-semibold">New Password:</label>
                <div className="relative w-full">
                  <input type={showPassword2 ? "text" : "password"} name="newPassword" value={newPassword} onChange={handleNewPasswordChange} className="border rounded-lg p-2" />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility2}
                    className="w-fit absolute right-2 top-2 p-1 border border-transparent bg-transparent hover:bg-transparent"
                  >
                    {showPassword2 ? (
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
              </div>
              <button onClick={handleUpdatePass} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                Update Password
              </button>
            </>
          ) : (
            <button onClick={handleEditPassword} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
              Edit Password
            </button>
          )}
        </div>
      </div>
      <Toaster />

    </div>

  );
}

export default Profile;
