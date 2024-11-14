import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import NavBarLoggedIn from "./assets/navBarOrg";
import ActivitiesListOrg from "./assets/activitiesListOrg";

function AdminHomePage() {
    const [activities, setActivities] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
    
        if (!token) {
          // Ako nema tokena, preusmjeri korisnika na login stranicu
          navigate('/not-authorized', { replace: true });
          return;
        }
    
        //ako postoji token, pošaljite zahtjev
        axios.get('http://localhost:8080/admin/home', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setActivities(response.data);
        })
        .catch((error) => {
          //ako dođe do greške (npr. token nije važeći ili server ne radi), preusmjeri na login
          console.error('Greška prilikom provjere tokena:', error);
          navigate('/not-authorized', { replace: true });
        });
      }, [navigate]); 


    

      return (
        <div className="relative min-h-screen">
          <div className="bg-slate-600 rounded-b-3xl text-white">
            <NavBarLoggedIn />
          </div>
    
          <h1 className="text-3xl font-bold text-gray-800">Admin Home Page</h1>
        </div>
      );
}

export default AdminHomePage;