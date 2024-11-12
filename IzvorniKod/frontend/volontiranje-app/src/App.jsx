import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import Options from "./components/Options";
import OrganizationLogin from "./components/OrganizationLogin";
import VolunteerLogin from "./components/VolunteerLogin";

import HomePage from "./pages/HomePage";
import NotAuthorized from "./pages/NotAuthorized";
import OrganizationHomePage from "./pages/OrganizationHomePage";
import VolunteerHomePage from "./pages/VolunteerHomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Options />} />
        <Route path="/register/volunteer" element={<VolunteerLogin />} />
        <Route path="/register/organization" element={<OrganizationLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path='/volunteer/home' element={<VolunteerHomePage />}/>
        <Route path='/organization/home' element={<OrganizationHomePage />}/>
        <Route path='/not-authorized' element={<NotAuthorized />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
