import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import VolunteerHome from "./VolunteerHome";
import OrganizationHome from "./OrganizationHome";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/volunteer/home" element={<VolunteerHome />} />
        <Route path="/organization/home" element={<OrganizationHome />} />
      </Routes>
    </Router>
  );
};

export default App;
