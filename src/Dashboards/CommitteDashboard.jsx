import React, { useState } from "react";
import Profile from "../Components/Profile";
import StudentReg from "../Components/StudentReg";
import SupervisorReg from "../Components/SupervisorReg";
import StudentList from "../Components/StudentList";
import SupervisorList from "../Components/SupervisorList";
import GroupList from "../Components/GroupList";
import GroupFormation from "../Components/GroupFormation";
import "./Styles/CommitteDashboard.css";
import NewsFeed from "../Components/NewsFeed";
import { Link } from "react-router-dom";

function CommitteDashboard() {
    const [selectedComponent, setSelectedComponent] = useState("Profile");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const renderComponent = () => {
        switch (selectedComponent) {
            case "Profile":
                return <Profile />;
            case "StudentReg":
                return <StudentReg />;
            case "SupervisorReg":
                return <SupervisorReg />;
            case "StudentList":
                return <StudentList />;
            case "SupervisorList":
                return <SupervisorList />;
            case "GroupFormation":
                return <GroupFormation />;
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
                    <p className="Logoword">Committe Dashboard</p>
                </div>
                <ul>
                    <li onClick={() => setSelectedComponent("Profile")}>Profile</li>
                    <li onClick={() => setSelectedComponent("StudentReg")}>Student Registration</li>
                    <li onClick={() => setSelectedComponent("SupervisorReg")}>Supervisor Registration</li>
                    <li onClick={() => setSelectedComponent("StudentList")}>Student List</li>
                    <li onClick={() => setSelectedComponent("SupervisorList")}>Supervisor List</li>
                    <li onClick={() => setSelectedComponent("GroupFormation")}>Group Formation</li>
                    <li onClick={() => setSelectedComponent("GroupList")}>Group List</li>
                    <li onClick={() => setSelectedComponent("NewsFeed")}>News Feed</li>
                    <Link to={'/'} style={{ textDecoration: 'none', color: 'white' }} onClick={handleLogout}> <li>Logout</li></Link>
                </ul>
            </div>
            {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
            <div className="content">{renderComponent()}</div>
        </div>
    );
}

export default CommitteDashboard;
