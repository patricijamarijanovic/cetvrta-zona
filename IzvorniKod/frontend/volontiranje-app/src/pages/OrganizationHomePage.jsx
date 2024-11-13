import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import NavBarLoggedIn from "./assets/navBarLoggedIn";
import Motivation from "./assets/motivationVolunteer";
import ActivitiesList from "./assets/activitiesList";


function OrganizationHomePage() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    function signOut() {
        localStorage.clear();
        navigate('/');

    }

    useEffect(() => {
        const token = localStorage.getItem('token');
    
        if (!token) {
          // Ako nema tokena, preusmjeri korisnika na login stranicu
          navigate('/organization/home', { replace: true });
          return;
        }
    
        // Ako postoji token, pošaljite zahtjev
        axios.get('http://localhost:8080/organization/home', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setMessage(response.data);
        })
        .catch((error) => {
          // Ako dođe do greške (npr. token nije važeći ili server ne radi), preusmjeri na login
          console.error('Greška prilikom provjere tokena:', error);
          navigate('/not-authorized', { replace: true });
        });
      }, [navigate]); 

     return(
      <div className="relative min-h-screen">
        <div className="bg-slate-600 rounded-b-3xl text-white">
          <NavBarLoggedIn />

        </div>
          <ActivitiesList />
      </div>
    )
}

export default OrganizationHomePage;