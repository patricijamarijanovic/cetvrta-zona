import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function VolunteerHomePage() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();



    function signOut() {
        localStorage.clear();
        navigate('/');

    }
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Tu je token!' + token)
        if (!token) {
          // Ako nema tokena, preusmjeri korisnika na login stranicu
          console.log('Tu sam!')
          navigate('/not-authorized', { replace: true });

          return;
        }
    
        // Ako postoji token, pošaljite zahtjev
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