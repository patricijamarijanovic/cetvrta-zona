import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login.css';
import axios from 'axios';


function Login() {
        const [username, setUsername] = useState('')
        const [password, setPassword] = useState('')
        const [errors, setError] = useState({})
        const navigate = useNavigate();

        const Validation = (values) => {
            let errors = {}
            
            if(!values.username) {
                errors.username = "Potrebno je unijeti korisničko ime."
            }
    
            if(!values.password) {
                errors.password = "Potrebno je unijeti lozinku."
            }
            
    
            
            return errors;
            
            
        } 
        // useEffect(() => {
        //     const token = localStorage.getItem('token');
        //     console.log('Tu je token!!' + token)
        //     if (token) {
        //       console.log("idemo")
        //       navigate('/not-authorized', { replace: true });
        
        //       return;
        //     }
        
            
        //   }, [navigate]); 

       

        const handleSubmit = async (e) => {
            e.preventDefault();
        
            const validationErrors = Validation({ username, password });
            setError(validationErrors);
    
        
            if (Object.keys(validationErrors).length === 0) {
                try {
                    const token = await axios.post("http://localhost:8080/authenticate", {
                        username: username,
                        password: password
                    });
                    //console.log("Odgovor sa servera:", response.data);
                    //const token = response.data.token;

                    if (token) {
                        console.log("Token:", JSON.stringify(token.data.jwt)); // Ispiši token u konzolu
                       
                        //alert("Token: " +  JSON.stringif(decoded.role)); // Prikaži token u alertu
                        // Spremi token u localStorage ako trebaš
                        localStorage.setItem("token", token.data.jwt);
                        localStorage.setItem("role", token.data.role);

                        if(token.data.role == 'ROLE_VOLUNTEER') {
                            navigate('/volunteer/home');
                        }
                        else if(token.data.role == 'ROLE_ORGANIZATION') {
                            navigate('/organization/home')
                        }
                        
                    } else {
                        alert("Nema tokena u odgovoru.");
                    }
                } catch (err) {
                   // alert(err);
                    setError((prevErrors) => ({
                        ...prevErrors,
                        pogreska: "Pogrešno korisničko ime ili lozinka."
                    }));
                }
            }
        }

        useEffect(() => {
            // Provjeri URL parametre
            console.log(" u use effectu sam!")
            const urlParams = new URLSearchParams(window.location.search);
            const tokenFromUrl = urlParams.get('token');
            const roleFromUrl = urlParams.get('role');
    
            // Ako postoji token i role u URL-u, postavi ih u state i localStorage
            if (tokenFromUrl && roleFromUrl) {
                localStorage.setItem('token', tokenFromUrl);
                localStorage.setItem('role', roleFromUrl);
    
                console.log("imam token!", localStorage.getItem('token'))
                console.log("imam role!", localStorage.getItem('role'))

                // Preusmjeri korisnika na odgovarajuću početnu stranicu
                if (roleFromUrl === "ROLE_VOLUNTEER") {
                    console.log("navigiram dalje na volonterski")
                    navigate("/volunteer/home");
                } else if (roleFromUrl === "ROLE_ORGANIZATION") {
                    console.log("navigiram dalje na organizacijski")
                    navigate("/organization/home");
                }
            }
            else {
                console.log("idkk")
            }
        }, [navigate]);

        const googleLogin = () => {
            window.location.href = "http://localhost:8080/oauth2/authorization/google";
        }
    

        return(
            <>
            <div className="background">
            <div class="cont1">
            <h1>Prijava</h1>
            <form onSubmit={handleSubmit}>
            <div className='container'>
            <div className='line'>
            
            <input value={username} onChange={(e)=>setUsername(e.target.value)} type="text"  placeholder="Korisničko ime"></input>
            </div>
            {errors.username && <p className="error" style={{color:"darkblue"}}>{errors.username}</p>}

            <div className='line'>
            
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Lozinka"></input>
            </div>
            {errors.password && <p className="error" style={{color:"darkblue"}}>{errors.password}</p>}
            {errors.pogreska && <p className="error" style={{color:"darkblue"}}>{errors.pogreska}</p>}

            </div>

            <button type="submit">Prijavi se</button>
           
            </form>
            <button onClick={googleLogin}>Login with Google</button>
            </div>
            </div>
            </>
        )
}

export default Login;