import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBarOrg from "../pages/assets/navBarOrg";

import axios from "axios";

function CreateProject() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [beginDate, setBeginDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [maxNumber, setMaxNumber] = useState(0);
  const [emergency, setEmergency] = useState(false);

  const [errors, setError] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const Validation = (values) => {
    let errors = {};

    if (!values.projectName) {
      errors.projectName = "Potrebno je unijeti ime projekta.";
    }

    if (!values.description) {
      errors.description = "Potrebno je unijeti opis projekta.";
    }

    if (!values.beginDate) {
      errors.beginDate = "Potrebno je unijeti datum početka projekta.";
    }

    if (!values.endDate) {
      errors.endDate = "Potrebno je unijeti datum završetka projekta.";
    }

    if (!values.location) {
      errors.location = "Potrebno je unijeti lokaciju.";
    }

    if (values.maxNumber === 0) {
      errors.maxNumber = "Potrebno je odabrati broj volontera.";
    }

    return errors;
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("TOKEN " + token);

    if (!token) {
      // Ako nema tokena, preusmjeri korisnika na login stranicu
      navigate("/not-authorized", { replace: true });
      return;
    }

    // Ako postoji token, pošaljite zahtjev
    axios
      .get("http://localhost:8080/organization/createproject", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMessage(response.data);
        console.log("ok!!");
      })
      .catch((error) => {
        // Ako dođe do greške (npr. token nije važeći ili server ne radi), preusmjeri na login
        console.error("Greška prilikom provjere tokena:", error);
        navigate("/not-authorized", { replace: true });
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = Validation({
      projectName,
      description,
      beginDate,
      endDate,
      location,
      maxNumber,
    });
    setError(validationErrors);
    console.log("nezz" + " " + Object.keys(validationErrors).length);
    const token = localStorage.getItem("token");

    if (Object.keys(validationErrors).length === 0) {
      console.log("prije slanja1");
      try {
        await axios.post(
          "http://localhost:8080/organization/createproject",
          {
            projectname: projectName,
            projectdesc: description,
            beginningdate: beginDate,
            enddate: endDate,
            projectlocation: location,
            numregisteredvolunteers: 0,
            maxnumvolunteers: maxNumber,
            urgent: emergency,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Zahtjev uspješno poslan");
        alert("Registracija uspješna!");
        navigate("/organization/home");
      } catch (err) {
        console.log("here!!");
        // alert(err);
        console.log(err);
      }
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const handleBeginDateChange = (e) => {
    const selectedBeginDate = e.target.value;
    setBeginDate(selectedBeginDate);

    if (endDate && selectedBeginDate > endDate) {
      setEndDate("");
    }
  };

  return (
    <>
      <div className="bg-slate-600 rounded-b-3xl text-white">
        <NavBarOrg />
      </div>

      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">
              OBJAVI PROJEKT
            </h1>
            <h2 className="text-xl text-gray-700">UNESITE DETALJE PROJEKTA</h2>
          </div>

          <div className="bg-slate-600 shadow-lg p-6 rounded-xl">
            <div>
              <h1 className="text-2xl font-semibold text-white pb-6">
                Podaci o projektu
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label
                  htmlFor="projectName"
                  className="text-white font-semibold"
                >
                  Ime projekta
                </label>
                <input
                  id="projectName"
                  name="projectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 ${
                    errors.projectName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ime projekta"
                />
                {errors.projectName && (
                  <p className="text-sm text-red-500">{errors.projectName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-white font-semibold"
                >
                  Opis projekta
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Opis projekta"
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="beginDate"
                    className="text-white font-semibold"
                  >
                    Datum početka projekta
                  </label>
                  <input
                    id="beginDate"
                    name="beginDate"
                    type="date"
                    min={today}
                    value={beginDate}
                    onChange={handleBeginDateChange}
                    className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 ${
                      errors.beginDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.beginDate && (
                    <p className="text-sm text-red-500">{errors.beginDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="endDate" className="text-white font-semibold">
                    Datum završetka projekta
                  </label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    min={beginDate || today}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 ${
                      errors.endDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-500">{errors.endDate}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="text-white font-semibold">
                  Lokacija
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Lokacija"
                />
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="maxNumber"
                    className="text-white font-semibold"
                  >
                    Broj potrebnih volontera
                  </label>
                  <input
                    id="maxNumber"
                    name="maxNumber"
                    type="number"
                    value={maxNumber}
                    onChange={(e) => setMaxNumber(e.target.value)}
                    min="0"
                    className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 ${
                      errors.maxNumber ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.maxNumber && (
                    <p className="text-sm text-red-500">{errors.maxNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-white font-semibold">
                    Volonteri hitno potrebni
                  </label>
                  <div
                    className="relative"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className="border rounded-lg p-3 cursor-pointer bg-white text-gray-700 flex justify-between items-center">
                      <span>{emergency ? "Da" : "Ne"}</span>
                      <img
                        src="/images/one-down-arrow.png"
                        alt="down arrow"
                        className="absolute right-3 top-1/2 -translate-y-1/2 size-4"
                      />
                    </div>

                    {dropdownOpen && (
                      <div className="absolute z-10 bg-white shadow-lg rounded-lg mt-2 w-full border">
                        <div
                          className={`p-3 cursor-pointer rounded-lg hover:bg-gray-200 ${
                            emergency === true
                              ? "bg-gray-100 font-semibold"
                              : ""
                          }`}
                          onClick={() => {
                            setEmergency(true);
                            setDropdownOpen(false);
                          }}
                        >
                          Da
                        </div>
                        <div
                          className={`p-3 cursor-pointer rounded-lg hover:bg-gray-200 ${
                            emergency === false
                              ? "bg-gray-100 font-semibold"
                              : ""
                          }`}
                          onClick={() => {
                            setEmergency(false);
                            setDropdownOpen(false);
                          }}
                        >
                          Ne
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.emergency && (
                    <p className="text-sm text-red-500">{errors.emergency}</p>
                  )}
                </div>
              </div>

              {errors.general && (
                <p className="text-sm text-red-500 text-center">
                  {errors.general}
                </p>
              )}

              <div className="flex justify-center gap-4 pt-6">
                <button
                  type="submit"
                  className="bg-yellow-300 text-black text-2xl py-2 px-4 rounded-s-3xl rounded-e-3xl hover:bg-yellow-400"
                >
                  Registriraj projekt
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setProjectName("");
                    setDescription("");
                    setBeginDate("");
                    setEndDate("");
                    setLocation("");
                    setMaxNumber(0);
                    setEmergency(false);
                    setError({});
                  }}
                  className="bg-red-500 text-white py-2 px-4 rounded-s-3xl rounded-e-3xl hover:bg-red-400"
                >
                  Izbriši podatke
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateProject;
