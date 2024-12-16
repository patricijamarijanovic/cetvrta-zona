import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import NavBarLoggedIn from "./assets/navBarOrg";
import ActivitiesListOrg from "./assets/activitiesListOrg";

// const BACK_URL = "backend-qns7.onrender.com";
// const BACK_URL = "https://backend-qns7.onrender.com";
const BACK_URL = "http://localhost:8080";

function OrganizationHomePage() {
    const [activities, setActivities] = useState([]);
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
          navigate('/not-authorized', { replace: true });
          return;
        }
    
        //ako postoji token, pošaljite zahtjev
        axios.get(`${BACK_URL}/organization/home`, {
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

      const handleCreateProject = () => {
        navigate("/organization/create-project");
      };

      return (
        <div className="relative min-h-screen">
          <div className="bg-slate-600 rounded-b-3xl text-white">
            <NavBarLoggedIn />
          </div>
    
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Moje Aktivnosti</h1>
              {activities.length > 0 && (
                <button
                  onClick={handleCreateProject}
                  className="bg-yellow-400 text-black py-2 px-6 text-lg rounded-full hover:bg-yellow-500 transition-colors"
                >
                  Kreiraj novi projekt
                </button>
              )}
            </div>
    
            {activities.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <p className="text-gray-500 text-lg">Nema ničeg ovdje... Promijeni to!</p>
                <button
                  onClick={handleCreateProject}
                  className="bg-yellow-400 text-black py-4 px-8 text-xl rounded-full hover:bg-yellow-500 transition-colors"
                >
                  Kreiraj novi projekt
                </button>
              </div>
            ) : (
              <div>
                <ActivitiesListOrg />
              </div>
            )}
          </div>
        </div>
      );
}

export default OrganizationHomePage;