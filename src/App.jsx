import { useState } from "react";
import LoginForm from "./Pages/LoginForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CommitteDashboard from "./Dashboards/CommitteDashboard";
import SuperDashboard from "./Dashboards/SuperDashboard";
import StudentDashboard from "./Dashboards/StudentDashboard";
import ProjectDashboard from "./Dashboards/ProjectDashboard";
import ScheduleMeeting from "./Components/ScheduleMeeting";
import Room from "./Components/Room";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<LoginForm />}></Route>
          <Route exact path="/StudentDashboard" element={<StudentDashboard />}></Route>
          <Route exact path="/SuperDashboard" element={<SuperDashboard />}></Route>
          <Route exact path="/CommitteeDashboard" element={<CommitteDashboard />}></Route>
          <Route exact path="/projectdashboard/:groupId" element={<ProjectDashboard />}></Route>
          <Route path="/room/:roomID" element={<Room />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;