import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


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
          //ako nema tokena, preusmjeri korisnika na login stranicu
          navigate('/not-authorized', { replace: true });
          return;
        }
    
        //ako postoji token, pošaljite zahtjev
        axios.get('http://localhost:8080/organization/home', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setMessage(response.data);
        })
        .catch((error) => {
          //ako dođe do greške (npr. token nije važeći ili server ne radi), preusmjeri na login
          console.error('Greška prilikom provjere tokena:', error);
          navigate('/not-authorized', { replace: true });
        });
      }, [navigate]); 

     return(
        <>
        <h1>Organization Home Page</h1>
        <button onClick={signOut}>Sign Out</button>
        </>
    )
}

export default OrganizationHomePage;