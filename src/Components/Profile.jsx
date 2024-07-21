import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Styles/Profile.css";


function Profile() {
  const username = localStorage.getItem("loggedInUser");
  const Role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

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
              setImagePreview(`https://fypms-back-end.vercel.app${response.data.photo}`);
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
          // setImagePreview(`http://localhost:5000${response.data.photo}`);
          setImagePreview(`https://fypms-back-end.vercel.app${response.data.photo}`);
        }
        alert("Profile updated successfully");
        setIsEditing(false);
      })
      .catch(error => {
        console.error("There was an error updating the profile!", error);
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
      alert("enter details")
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
          alert(response.data.message);
        } catch (error) {
          console.error('Error updating password:', error);
          alert(error.response.data.message || 'Error updating password');
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
          alert(response.data.message);
        } catch (error) {
          console.error('Error updating password:', error);
          alert(error.response.data.message || 'Error updating password');
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
          alert(response.data.message);
        } catch (error) {
          console.error('Error updating password:', error);
          alert(error.response.data.message || 'Error updating password');
        }
      }
    }

  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-grid">
        <div className="profile-photo-container">
          {imagePreview && <img src={imagePreview} alt="Profile Preview" className="profile-photo" />}
        </div>
        <div className="profile-details">
          {isEditing ? (
            <>
              <label>Name:</label>
              <input type="text" name="name" value={user.name} onChange={handleInputChange} />
              <label>Address:</label>
              <input type="text" name="address" value={user.address} onChange={handleInputChange} />
              <label>Email:</label>
              <input type="email" name="email" value={user.email} onChange={handleInputChange} />
              <label>Phone Number:</label>
              <input type="tel" name="phone" value={user.phone} onChange={handleInputChange} />
              <label>Photo:</label>
              <input type="file" name="photo" onChange={handlePhotoChange} />
              <button onClick={handleSave}>Save Profile</button>
            </>
          ) : (
            <>
              <div className="profile-info">
                <label>Name:</label>
                <p>{user.name}</p>
                <label>Address:</label>
                <p>{user.address}</p>
                <label>Email:</label>
                <p>{user.email}</p>
                <label>Phone Number:</label>
                <p>{user.phone}</p>
              </div>
              <button onClick={handleEdit}>Edit Profile</button>
            </>
          )}
        </div>

        <div className="profile-details">
          {
            isEditPassword ? (
              <>
                <label>Old Password:</label>
                <input type="text" name="Old Password" value={oldPassword} onChange={handleOldPasswordChange} />
                <label>New Password:</label>
                <input type="text" name="New Password" value={newPassword} onChange={handleNewPasswordChange} />
                <button onClick={handleUpdatePass}>Update Password</button>
              </>
            ) : (
              <>
                <button onClick={handleEditPassword}>Edit Password</button>
              </>
            )
          }

        </div>
      </div>
    </div>
  );
}

export default Profile;
