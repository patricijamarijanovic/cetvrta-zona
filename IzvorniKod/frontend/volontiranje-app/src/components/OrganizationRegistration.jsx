import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios'

function OrganizationLogin() {

    const [username, setUsername] = useState('');
    const [orgName, setOrgName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    
    const navigate = useNavigate();

    const [errors, setError] = useState({})
   
    const Validation = (values) => {
        let errors = {}
        
        if(!values.username) {
            errors.username = "Potrebno je unijeti korisničko ime."
        }

        if(!values.password) {
            errors.password = "Potrebno je unijeti lozinku."
        }
        else if(values.password.length < 8) {
            errors.password = "Lozinka mora sadržavati minimalno 8 znakova."
        }

        
        if (!values.password2) {
            errors.password2 = "Potrebno je ponoviti lozinku.";
        } else if (values.password !== values.password2) {
            errors.password2 = "Lozinke se ne podudaraju.";
        }

        if(!values.orgName) {
            errors.orgName = "Potrebno je unijeti ime organizacije."
        }

       
        if(!values.email) {
            errors.email = "Potrebno je unijeti email."
        }
        else if(!values.email.includes('@')) {
            errors.email = "Pogrešan format maila."
        }

        
        return errors;
        
        
    } 

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Tu je token!!' + token)
        if (token) {
          console.log("idemo")
        //   navigate('/not-authorized', { replace: true });
    
          return;
        }
    
        
      }, [navigate]); 


    const handleSubmit = async (e) => {
        e.preventDefault();
        

        const validationErrors = Validation({ username, email, password, password2, orgName});
        setError(validationErrors);

     
        if (Object.keys(validationErrors).length === 0) {
            try {
                await axios.post("http://localhost:8080/register/organization", {
                    username: username,
                    password: password,
                    email: email,
                    organizationName: orgName
                });
                alert("Registracija uspješna!");
            } catch (err) {
                //alert(err);
                    // alert(err);jel
               console.log(err.response)
               if (err.response && err.response.data === "Username already taken. Please choose another one.") {
                setError((prevErrors) => ({
                    ...prevErrors,
                    username: "Korisničko ime već postoji."
                }));
            } else if (err.response && err.response.data === "Email already registered. Please choose another one.") {
                setError((prevErrors) => ({
                    ...prevErrors,
                    email: "Email adresa već postoji."
                }));
             } else if (err.response && err.response.data === "") {
                    setError((prevErrors) => ({
                        ...prevErrors,
                        orgName: "Ime organizacije već postoji."
                    }));
            } else {
                setError((prevErrors) => ({
                    ...prevErrors,
                    pogreska: "Došlo je do greške."
                }));
            }
            }
        }
    }

    function BackToHome() {
        navigate('/');
    }

   



    return(
        <>
        <h1>Registracija organizacije</h1>
        <form onSubmit={handleSubmit}>
            <div className='container'>
            <div className='line'>
            <input value={username} onChange={(e)=>setUsername(e.target.value)} type="text" placeholder='Korisničko ime'></input>
            </div>
            {errors.username && <p className="error" style={{color:"darkblue"}}>{errors.username}</p>}

            <div className='line'>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='Lozinka'></input>
            </div>
            {errors.password && <p className="error" style={{color:"darkblue"}}>{errors.password}</p>}

            
            <div className='line'>
            <input value={password2} onChange={(e)=>setPassword2(e.target.value)} type="password" placeholder='Ponovi lozinku'></input>
            </div>
            {errors.password2 && <p className="error" style={{color:"darkblue"}}>{errors.password2}</p>}

            <div className='line'>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="text" placeholder='Email adresa'></input>
            </div>
            {errors.email && <p className="error" style={{color:"darkblue"}}>{errors.email}</p>}

            <div className='line'>
            <input value={orgName} onChange={(e)=>setOrgName(e.target.value)} type="text" placeholder='Ime organizacije'></input>
            </div>
            {errors.orgName && <p className="error" style={{color:"darkblue"}}>{errors.orgName}</p>}
            {errors.pogreska && <p className="error" style={{color:"darkblue"}}>{errors.pogreska}</p>}

            <button type="submit">Registriraj se</button>
            <button onClick={BackToHome}>Home</button>
            </div>


        </form>
        </>
    );
}

export default OrganizationLogin;