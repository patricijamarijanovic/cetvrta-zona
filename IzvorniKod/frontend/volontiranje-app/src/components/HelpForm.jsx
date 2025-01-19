import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../pages/assets/navBar";
import axios from "axios";

// const BACK_URL = "backend-qns7.onrender.com";
// const BACK_URL = "https://backend-qns7.onrender.com";
const BACK_URL = "http://localhost:8080";

function HelpForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mail, setMail] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setError] = useState([]);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (loading) return;
    setLoading(true);

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
        const response = await axios.post(`${BACK_URL}/home/send-complaint`, {
          title: title,
          description: description,
          firstName: firstName,
          lastName: lastName,
          email: mail,
        });
        console.log("Uspješno slanje pritužbe!");
        setFormSubmitted(true);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-slate-600 rounded-b-3xl text-white">
        <NavBar />
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 mt-8">
        {formSubmitted ? (
          <h1 className="text-3xl font-bold text-yellow-500 text-center">
            Vaš je problem prijavljen. Naš će ga tim pokušati riješiti u što
            bržem roku.
          </h1>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
              Prijavite problem
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="text-gray-700 font-semibold"
                  >
                    Ime
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Unesite ime"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="text-gray-700 font-semibold"
                  >
                    Prezime
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Unesite prezime"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="mail" className="text-gray-700 font-semibold">
                    E-mail
                  </label>
                  <input
                    id="mail"
                    name="mail"
                    type="email"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 ${
                      errors.mail ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Unesite e-mail adresu"
                  />
                  {errors.mail && (
                    <p className="text-sm text-red-500">{errors.mail}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-gray-700 font-semibold"
                  >
                    Naslov problema
                  </label>
                  <input
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Unesite naslov problema"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="description"
                    className="text-gray-700 font-semibold"
                  >
                    Opis problema
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Detaljno opišite problem"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  className="bg-yellow-400 text-black text-xl font-semibold py-3 px-6 rounded-full shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                >
                  Pošalji
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default HelpForm;
