import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import Options from "./components/Options";
import OrganizationLogin from "./components/OrganizationRegistration";
import VolunteerLogin from "./components/VolunteerRegistration";

import HomePage from "./pages/HomePage";
import NotAuthorized from "./pages/NotAuthorized";
import OrganizationHomePage from "./pages/OrganizationHomePage";
import VolunteerHomePage from "./pages/VolunteerHomePage";
import CreateProject from "./components/CreateProject";
import AdminHomePage from "./pages/AdminHomePage";

import ErrorPage from "./pages/ErrorPage";

import ChooseRole from "./components/ChooseRole";

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
        <Route path='/organization/create-project' element={<CreateProject />}/>
        <Route path='admin/home' element={<AdminHomePage />}/>
        <Route path='choose-role' element={<ChooseRole />}/>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
