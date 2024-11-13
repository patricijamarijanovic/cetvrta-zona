import { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

function CreateProject() {
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [beginDate, setBeginDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [location, setLocation] = useState('');
    const [maxNumber, setMaxNumber] = useState(0);
    const [emergency, setEmergency] = useState(false);

    const [errors, setError] = useState({})

    const navigate = useNavigate();
    const [message, setMessage] = useState('');


    const Validation = (values) => {
        let errors = {}
        
        if(!values.projectName) {
            errors.projectName = "Potrebno je unijeti ime projekta."
        }

        if(!values.description) {
            errors.description = "Potrebno je unijeti opis projekta."
        }

        if (!values.beginDate) {
            errors.beginDate = "Potrebno je unijeti datum početka projekta.";
        } 

        if(!values.endDate) {
            errors.endDate = "Potrebno je unijeti datum završetka projekta."
        }

        

        if(!values.location) {
            errors.location = "Potrebno je unijeti lokaciju."
        }
      

        if(values.maxNumber === 0) {
            errors.maxNumber = "Potrebno je odabrati broj volontera."
        }



        return errors;
        
    } 
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log("TOKEN " + token);
    
        if (!token) {
          // Ako nema tokena, preusmjeri korisnika na login stranicu
          navigate('/not-authorized', { replace: true });
          return;
        }
    
        // Ako postoji token, pošaljite zahtjev
        axios.get('http://localhost:8080/organization/createproject', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setMessage(response.data);
          console.log("ok!!")
        })
        .catch((error) => {
          // Ako dođe do greške (npr. token nije važeći ili server ne radi), preusmjeri na login
          console.error('Greška prilikom provjere tokena:', error);
          navigate('/not-authorized', { replace: true });
        });
      }, [navigate]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        
        const validationErrors = Validation({ projectName, description, beginDate, endDate, location, maxNumber});
        setError(validationErrors);
        console.log("nezz" + " " + Object.keys(validationErrors).length)
        const token = localStorage.getItem('token');
    
        if (Object.keys(validationErrors).length === 0) {
            console.log("prije slanja1")
            try {
                await axios.post("http://localhost:8080/organization/createproject", 
                {
                    projectname: projectName,
                    projectdesc: description,
                    beginningdate: beginDate,
                    enddate: endDate,
                    projectlocation: location,
                    numregisteredvolunteers: 0,
                    maxnumvolunteers: maxNumber,
                    urgent: emergency
                }, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Zahtjev uspješno poslan");
                alert("Registracija uspješna!");
            } catch (err) {
                console.log("here!!")
               // alert(err);
                console.log(err)
            
            }
        }
    }
   

    return (
        <>
            <h1>Objavi projekt</h1>
            <form onSubmit={handleSubmit}>
                <div className='container'>
                    <div className='line'>
                        <input value={projectName} onChange={(e) => setProjectName(e.target.value)} type="text" placeholder='Ime projekta' />
                    </div>
                    {errors.projectName && <p className="error" style={{ color: "darkblue" }}>{errors.projectName}</p>}

                    <div className='line'>
                        <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" placeholder='Opis projekta' />
                    </div>
                    {errors.description && <p className="error" style={{ color: "darkblue" }}>{errors.description}</p>}

                    <div className='line'>
                        <label>
                            Datum početka projekta:
                            <input value={beginDate} onChange={(e) => setBeginDate(e.target.value)} type="date" />
                        </label>
                    </div>
                    {errors.beginDate && <p className="error" style={{ color: "darkblue" }}>{errors.beginDate}</p>}

                    <div className='line'>
                        <label>
                            Datum završetka projekta:
                            <input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" />
                        </label>
                    </div>
                    {errors.endDate && <p className="error" style={{ color: "darkblue" }}>{errors.endDate}</p>}

                    <div className='line'>
                        <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" placeholder='Lokacija' />
                    </div>
                    {errors.location && <p className="error" style={{ color: "darkblue" }}>{errors.location}</p>}

                    <div className='line'>
                        <label>
                            Broj potrebnih volontera:
                            <input 
                                value={maxNumber} 
                                onChange={(e) => setMaxNumber(e.target.value)} 
                                type="number" 
                                placeholder='0' 
                                min="0" 
                                style={{ width: "60px", marginLeft: "10px" }} 
                            />
                        </label>
                    </div>
                    {errors.maxNumber && <p className="error" style={{ color: "darkblue" }}>{errors.maxNumber}</p>}

                    <div className='line'>
                        <label>
                            Volonteri hitno potrebni:
                            <select value={emergency} onChange={(e) => setEmergency(e.target.value === "true")}>
                                <option value="false">Ne</option>
                                <option value="true">Da</option>
                            </select>
                        </label>
                    </div>
                   

                    <button type="submit">Registriraj projekt</button>
                </div>
            </form>
        </>
    );
}

export default CreateProject;