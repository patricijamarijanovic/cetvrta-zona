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

import ActivitiesPage from "./pages/ActivitiesPage";

import ActivityInfo from "./pages/ActivityInfo";
import ActivityInfoVolunteer from "./pages/ActivityInfoVolunteer";
import ActivityInfoOrganization from "./pages/ActivityInfoOrganization";

import ActivitiesPageVol from "./pages/ActivitiesPageVol";
import OrgnizationsPage from "./pages/OrganizationsPage";
import OrgnizationsPageVol from "./pages/OrganizationsPageVol";

import VolunteerProfileEdit from "./pages/VolunteerProfileEdit";
import OrganizationProfileEdit from "./pages/OrganizationProfileEdit";

import MyActivities from "./pages/myActivities";

import OrganizationProfilePage from "./pages/OrganizationProfilePage";
import VolunteerProfilePage from "./pages/VolunteerProfilePage";

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
        <Route path='/activity/:id' element={<ActivityInfo/>}/>
        <Route path='/volunteer/activity/:id' element={<ActivityInfoVolunteer/>}/>
        <Route path='/organization/activity/:id' element={<ActivityInfoOrganization/>}/>

        <Route path='/activities-page' element={<ActivitiesPage />}/>
        <Route path='/volunteer/activities-page' element={<ActivitiesPageVol />}/>

        <Route path='/organizations-page' element={<OrgnizationsPage />}/>
        <Route path='/volunteer/organizations-page' element={<OrgnizationsPageVol />}/>
          
        <Route path="/volunteer/profileEdit" element={<VolunteerProfileEdit />} />
        <Route path="/organization/profileEdit" element={<OrganizationProfileEdit />} />

        <Route path="/volunteer/my-activities" element={<MyActivities />} />

        <Route path="/profile/organization/:organizationId" element={<OrganizationProfilePage />} />
        <Route path="/profile/volunteer/:volunteerId" element={<VolunteerProfilePage />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
