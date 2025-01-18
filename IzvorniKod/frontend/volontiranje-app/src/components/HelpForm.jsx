import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../pages/assets/navBar";
import axios from "axios";

// const BACK_URL = "backend-qns7.onrender.com";
// const BACK_URL = "https://backend-qns7.onrender.com";
const BACK_URL = "http://localhost:8080";



function HelpForm() {

    const[firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mail, setMail] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setError] = useState([]);


    const Validation = (values) => {
        let errors = {};
    
        
    
        if (!values.firstName) {
          errors.firstName = "Potrebno je unijeti ime.";
        }
    
        if (!values.lastName) {
          errors.lastName = "Potrebno je unijeti prezime.";
        }
    
        if (!values.mail) {
          errors.mail = "Potrebno je unijeti email.";
        } else if (!values.mail.includes("@")) {
          errors.mail = "Pogrešan format maila.";
        }
    
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
           
            firstName,
            lastName,
            mail,
            title,
            description,
        });

        setError(validationErrors);

        
    if (Object.keys(validationErrors).length === 0) {
        
        try {
          const response = await axios.post(
            `${BACK_URL}/home/send-complaint`,
            {
              title: title,
              description: description,
              firstName: firstName,
              lastName: lastName,
              email: mail
            },
            
            
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
        <NavBar />
      </div>
      <h1>Prijavite problem</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  

                
                  <div className="space-y-2">
                   
                    <label
                      htmlFor="firstName"
                      className="text-white font-semibold"
                    >
                      Ime
                    </label>
                    <p>Ime:</p>
                    <input
                      id="firstName"
                      name="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 ${
                        errors.username ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="lastName"
                      className="text-white font-semibold"
                    >
                      Prezime
                    </label>
                    <p>Prezime:</p>
                    <input
                      id="lastName"
                      name="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 ${
                        errors.username ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="mail"
                      className="text-white font-semibold"
                    >
                      Mail
                    </label>
                    <p>Mail:</p>
                    <input
                      id="mail"
                      name="mail"
                      value={mail}
                      onChange={(e) => setMail(e.target.value)}
                      className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 ${
                        errors.username ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.mail && (
                      <p className="text-sm text-red-500">{errors.mail}</p>
                    )}
                  </div>

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
  
export default HelpForm;
  