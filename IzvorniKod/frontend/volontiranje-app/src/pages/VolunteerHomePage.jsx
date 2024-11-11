import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

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
          // Ako nema tokena, preusmjeri korisnika na login stranicu
          console.log('nema tokena!')
          navigate('/not-authorized', { replace: true });

          return;
        }
    
        // Ako postoji token, pošaljite zahtjev
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
        <>
        <h1>Volunteer Home Page</h1>
        <button onClick={signOut}>Sign Out</button>
        </>
    )
}

export default VolunteerHomePage;