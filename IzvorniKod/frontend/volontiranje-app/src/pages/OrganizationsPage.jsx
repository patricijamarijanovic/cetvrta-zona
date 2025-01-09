import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
//import Card from "./card";
//import axios from "axios";

import NavBar from "./assets/navBar"
import OrganizationsList from "./assets/organizationsList";

const BACK_URL = "http://localhost:8080";

function OrgnizationsPage() {

    console.log("na stranici sam s organizacijama");

    const [error, setError] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen">
            <div className="bg-slate-600 rounded-b-3xl text-white">
            <NavBar />
            </div>
            <OrganizationsList />
        </div>
        );
    }

export default OrgnizationsPage;