import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import NavBarLoggedIn from "./assets/navBarVol";
import Motivation from "./assets/motivationVolunteer";
import ActivitiesList from "./assets/activitiesList";

function VolunteerHomePage() {
  console.log("u volonteskom home pageu1")
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();


    function signOut() {
        localStorage.clear();
        navigate('/');

    }
    useEffect(() => {
        console.log("u volonteskom home pageu")
        const token = localStorage.getItem('token');
        console.log('Tu je token!' + token)
        if (!token) {

          console.log('nema tokena!')
          navigate('/not-authorized', { replace: true });

          return;
        }
    
   
        console.log("saljem token na backend")
        axios.get('http://localhost:8080/volunteer/home', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setMessage(response.data);
          console.log('Tu sam!')
        })
        .catch((error) => {
          console.log("error: ", error)
          console.error('Greška prilikom provjere tokena:', error.message); // Dodano ispisivanje glavne poruke
          if (error.response) {
            console.error('Odgovor poslužitelja:', error.response.data); // Dodano ispisivanje server response data
          }
          navigate('/not-authorized', { replace: true });
        });
      }, [navigate]); 
  

    return(
      <div className="relative min-h-screen">
        <div className="bg-slate-600 rounded-b-3xl text-white">
          <NavBarLoggedIn />
          <Motivation />
        </div>
          <ActivitiesList />
      </div>
    )
}

export default VolunteerHomePage;