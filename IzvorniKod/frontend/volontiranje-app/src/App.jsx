import VolunteerLogin from "./components/VolunteerLogin"
import OrganizationLogin from "./components/OrganizationLogin"
import {BrowserRouter, Route, Routes } from 'react-router-dom'
import Options from "./components/Options"
import Login from "./components/Login"
import VolunteerHomePage from "../pages/VolunteerHomePage"
import OrganizationHomePage from "../pages/OrganizationHomePage"
import HomePage from "../pages/HomePage"
import NotAuthorized from "../pages/NotAuthorized"

function App() {
  

  return (

   <BrowserRouter>
   <Routes>
    <Route path='/' element={<HomePage />}/>
    <Route path="/register" element={<Options />} /> 
    <Route path='/register/volunteer' element={<VolunteerLogin />}/>
    <Route path='/register/organization' element={<OrganizationLogin />}/>
    <Route path='/login' element={<Login />}/>
    <Route path='/volunteer/home' element={<VolunteerHomePage />}/>
    <Route path='/organization/home' element={<OrganizationHomePage />}/>
    <Route path='/not-authorized' element={<NotAuthorized />}/>

   </Routes>
   </BrowserRouter>

   
  )
}

export default App
