import React, { useState } from "react";
import Profile from "../Components/Profile";
import GroupList from "../Components/GroupList";
import "./Styles/CommitteDashboard.css";
import NewsFeed from "../Components/NewsFeed";
import { Link } from "react-router-dom";

function SuperDashboard() {
    const [selectedComponent, setSelectedComponent] = useState("Profile");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            <button className="hamburger" onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(!isSidebarOpen); }}>
                &#9776;
            </button>
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div>
                    <p className="Logoword">Supervisor Dashboard</p>
                </div>
                <ul>
                    <li onClick={() => setSelectedComponent("Profile")}>Profile</li>
                    <li onClick={() => setSelectedComponent("GroupList")}>Group List</li>
                    <li onClick={() => setSelectedComponent("NewsFeed")}>News Feed</li>
                    <Link to={'/'} style={{textDecoration: 'none', color: 'white'}} onClick={handleLogout}> <li>Logout</li></Link>
                </ul>
            </div>
            {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
            <div className="content">{renderComponent()}</div>
        </div>
    );
}

export default SuperDashboard;
