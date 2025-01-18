import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../pages/assets/navBar";
import NavBarLoggedIn from "../pages/assets/navBarVol";
import axios from "axios";

// const BACK_URL = "backend-qns7.onrender.com";
// const BACK_URL = "https://backend-qns7.onrender.com";
const BACK_URL = "http://localhost:8080";



function HelpFormVol() {

   
   
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setError] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        console.log("u volonteskom home pageu");
        const token = localStorage.getItem("token");
        console.log("Tu je token!" + token);
        if (!token) {
          console.log("nema tokena!");
          navigate("/not-authorized", { replace: true });
    
          return;
        }
    
        console.log("saljem token na backend");
        axios
          .get(`${BACK_URL}/volunteer/home`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setMessage(response.data);
            console.log("Tu sam!");
          })
          .catch((error) => {
            console.log("error: ", error);
            console.error("Greška prilikom provjere tokena:", error.message); // Dodano ispisivanje glavne poruke
            if (error.response) {
              console.error("Odgovor poslužitelja:", error.response.data); // Dodano ispisivanje server response data
            }
            navigate("/not-authorized", { replace: true });
          });
      }, [navigate]);


    const Validation = (values) => {
        let errors = {};
    
        
    
       
    
        if (!values.title) {
          errors.title = "Potrebno je unijeti naslov.";
        }

        if (!values.description) {
            errors.description = "Potrebno je unijeti opis.";
          }

    
        return errors;
      };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = Validation({
           
          
            title,
            description,
        });

        setError(validationErrors);

        
    if (Object.keys(validationErrors).length === 0) {
        const token = localStorage.getItem("token");
        
        try {
          const response = await axios.post(
            `${BACK_URL}/volunteer/send-complaint`,
            {
              title: title,
              description: description,
              
            },{
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            
            
          );
          console.log("Uspješno slanje pritužbe!")
        } catch (err) {
                console.log(err);
        }
    }
}



    return (
      <div>
        <div className="bg-slate-600 rounded-b-3xl text-white">
        <NavBarLoggedIn />
      </div>
      <h1>Prijavite problem</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  

                
                  

                  <div className="space-y-2">
                    <label
                      htmlFor="title"
                      className="text-white font-semibold"
                    >
                      Naslov
                    </label>
                    <p>Naslov:</p>
                    <input
                      id="title"
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 ${
                        errors.username ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-white font-semibold"
                >
                  Opis problema
                </label>
                <p>Opis:</p>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Opis problema"
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>


                 

                  
                </div>


                <div className="flex justify-center gap-4 pt-6">
                  <button
                    type="submit"
                    class="bg-yellow-300 text-black text-2xl py-2 px-4 rounded-s-3xl rounded-e-3xl hover:bg-yellow-400"
                    
                  >
                    Pošalji
                  </button>
                </div>

            
              </form>

        </div>
    );
  }
  
export default HelpFormVol;
  