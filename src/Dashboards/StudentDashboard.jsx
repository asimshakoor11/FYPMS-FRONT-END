import React, { useState, useEffect } from "react";
import Profile from "../Components/Profile";
import "./Styles/CommitteDashboard.css";
import NewsFeed from "../Components/NewsFeed";
import { Link, useNavigate } from "react-router-dom";
import GroupList from "../Components/GroupList";
import PastProjectsRecords from "../Components/PastProjectsRecords";

function StudentDashboard() {
    const [selectedComponent, setSelectedComponent] = useState("Profile");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/')
        }
    })

    const renderComponent = () => {
        switch (selectedComponent) {
            case "Profile":
                return <Profile />;
            case "GroupList":
                return <GroupList />;
            case "NewsFeed":
                return <NewsFeed />;
            
            default:
                return <Profile />;
        }
    };

    const closeSidebar = () => {
        if (isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    };

    const handleLogout = () => {
        localStorage.setItem("loggedInUser", "");
        localStorage.setItem("loggedInUserName", "");
        localStorage.setItem("userRole", "");
        localStorage.setItem('token', "");
    }



    return (
        <div className="fyp-dashboard" onClick={closeSidebar}>
            <button className="hamburger hover:bg-transparent" onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(!isSidebarOpen); }}>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" height="25" x="0" y="0" viewBox="0 0 512 512" style={{ enableBackground: 'new 0 0 512 512' }}
                    xml:space="preserve"><g><path d="M480 224H32c-17.673 0-32 14.327-32 32s14.327 32 32 32h448c17.673 0 32-14.327 32-32s-14.327-32-32-32zM32 138.667h448c17.673 0 32-14.327 32-32s-14.327-32-32-32H32c-17.673 0-32 14.327-32 32s14.327 32 32 32zM480 373.333H32c-17.673 0-32 14.327-32 32s14.327 32 32 32h448c17.673 0 32-14.327 32-32s-14.327-32-32-32z" fill="#000000" opacity="1" data-original="#000000"></path></g></svg>
            </button>
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div>
                    <p className="Logoword font-BebasNeueSemiExpBold text-3xl">Student Dashboard</p>
                </div>
                <ul className="space-y-1">
                    <li className={`${selectedComponent === 'Profile' ? 'bg-[#0056b3]' : 'bg-transparent'}`} onClick={() => { setSelectedComponent("Profile"); setIsSidebarOpen(!isSidebarOpen); }}>Profile</li>
                    <li className={`${selectedComponent === 'NewsFeed' ? 'bg-[#0056b3]' : 'bg-transparent'}`} onClick={() => { setSelectedComponent("NewsFeed"); setIsSidebarOpen(!isSidebarOpen); }}>News Feed</li>
                    <li className={`${selectedComponent === 'GroupList' ? 'bg-[#0056b3]' : 'bg-transparent'}`} onClick={() => { setSelectedComponent("GroupList"); setIsSidebarOpen(!isSidebarOpen); }}>Group List</li>
                    <Link to={'/'} style={{ textDecoration: 'none', color: 'white' }} onClick={handleLogout}> <li>Logout</li></Link>
                </ul>
            </div>
            {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
            <div className="content">{renderComponent()}</div>
        </div>
    );
}

export default StudentDashboard;
