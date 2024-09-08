import React, { useState, useEffect } from "react";
import Profile from "../Components/Profile";
import StudentReg from "../Components/StudentReg";
import SupervisorReg from "../Components/SupervisorReg";
import StudentList from "../Components/StudentList";
import SupervisorList from "../Components/SupervisorList";
import GroupList from "../Components/GroupList";
import GroupFormation from "../Components/GroupFormation";
import "./Styles/CommitteDashboard.css";
import NewsFeed from "../Components/NewsFeed";
import { Link, useNavigate } from "react-router-dom";
import ComDashboard from "./ComDashboard";
import PastProjectsRecords from "../Components/PastProjectsRecords";

function CommitteDashboard() {
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
            // case "Dashboard":
            //     return <ComDashboard />;
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
            case "ProejectRecords":
                return <PastProjectsRecords />;
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
                    <p className="Logoword font-BebasNeueSemiExpBold text-3xl">Committee Dashboard</p>
                </div>
                <ul className="space-y-1">
                    {/* <li className={`${selectedComponent === 'Dashboard' ? 'bg-[#0056b3]' : 'bg-transparent' }`} onClick={() => setSelectedComponent("Dashboard")}>Dashboard</li> */}
                    <li className={`${selectedComponent === 'Profile' ? 'bg-[#0056b3]' : 'bg-transparent'}`} onClick={() => setSelectedComponent("Profile")}>Profile</li>
                    <li className={`${selectedComponent === 'StudentReg' ? 'bg-[#0056b3]' : 'bg-transparent'}`} onClick={() => setSelectedComponent("StudentReg")}>Student Registration</li>
                    <li className={`${selectedComponent === 'SupervisorReg' ? 'bg-[#0056b3]' : 'bg-transparent'}`} onClick={() => setSelectedComponent("SupervisorReg")}>Supervisor Registration</li>
                    <li className={`${selectedComponent === 'StudentList' ? 'bg-[#0056b3]' : 'bg-transparent'}`} onClick={() => setSelectedComponent("StudentList")}>Student List</li>
                    <li className={`${selectedComponent === 'SupervisorList' ? 'bg-[#0056b3]' : 'bg-transparent'}`} onClick={() => setSelectedComponent("SupervisorList")}>Supervisor List</li>
                    <li className={`${selectedComponent === 'GroupFormation' ? 'bg-[#0056b3]' : 'bg-transparent'}`} onClick={() => setSelectedComponent("GroupFormation")}>Groups Formation</li>
                    <li className={`${selectedComponent === 'GroupList' ? 'bg-[#0056b3]' : 'bg-transparent'}`} onClick={() => setSelectedComponent("GroupList")}>Groups List</li>
                    <li className={`${selectedComponent === 'NewsFeed' ? 'bg-[#0056b3]' : 'bg-transparent'}`} onClick={() => setSelectedComponent("NewsFeed")}>News Feed</li>
                    <li className={`${selectedComponent === 'ProejectRecords' ? 'bg-[#0056b3]' : 'bg-transparent'}`} onClick={() => setSelectedComponent("ProejectRecords")}>Project Records</li>
                    <Link to={'/'} style={{ textDecoration: 'none', color: 'white' }} onClick={handleLogout}> <li className={`${selectedComponent === '' ? 'bg-[#0056b3]' : 'bg-transparent'}`}>Logout</li></Link>
                </ul>
            </div>
            {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
            <div className="content">{renderComponent()}</div>
        </div>

    );
}

export default CommitteDashboard;
