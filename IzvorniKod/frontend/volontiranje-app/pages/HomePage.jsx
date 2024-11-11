import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";




function HomePage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Tu je token!!' + token)
        if (token) {
          
          navigate('/not-authorized', { replace: true });
    
          return;
        }
    
        
      }, [navigate]); 

      function LogIn() {
        navigate('/login');

      }

      function SignUp() {
        navigate('/register');
      }
    
    return(
        <>
        <h1>Volontiraj s nama!</h1>
        <button onClick={LogIn}>Prijavi se</button>
        <button onClick={SignUp}>Registriraj se</button>
        </>
    )
}

export default HomePage;