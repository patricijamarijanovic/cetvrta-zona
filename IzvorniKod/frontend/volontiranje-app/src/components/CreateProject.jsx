import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBarOrg from "../pages/assets/navBarOrg";
import axios from "axios";

// const BACK_URL = "backend-qns7.onrender.com";
// const BACK_URL = "https://backend-qns7.onrender.com";
const BACK_URL = "http://localhost:8080";

function CreateProject() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [beginDate, setBeginDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [maxNumber, setMaxNumber] = useState(1);
  const [emergency, setEmergency] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errors, setError] = useState({});
  const [emergencyDropdownOpen, setEmergencyDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    "DJECA",
    "INVALIDI",
    "STARIJI",
    "SPORT",
    "ŽIVOTINJE",
    "EDUKACIJA",
    "ZDRAVLJE",
    "OKOLIŠ",
    "OSTALO",
  ];

  const navigate = useNavigate();

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
    if (!values.selectedCategory) {
      errors.selectedCategory = "Potrebno je odabrati kategoriju projekta.";
    }

    return errors;
  };

  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  function handleImage(e) {
    console.log(e.target.files);
    setImage(e.target.files[0]);

    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfilePicture(imageURL); // Postavljamo novu sliku u stanje
      console.log("odabrana slika " + imageURL);
    }
  }

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
      .get(`${BACK_URL}/organization/createproject`, {
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
    if(loading) return;
    setLoading(true);

    const validationErrors = Validation({
      projectName,
      description,
      beginDate,
      endDate,
      location,
      maxNumber,
      selectedCategory,
    });

    setError(validationErrors);

    if (selectedCategory === "OKOLIŠ") {
      setCategory("OKOLIS");
    }

    if (selectedCategory === "ŽIVOTINJE") {
      setCategory("ZIVOTINJE");
    }
    console.log(selectedCategory);

    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 2000);

    if (Object.keys(validationErrors).length === 0) {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post(
          `${BACK_URL}/organization/createproject`,
          {
            name: projectName,
            desc: description,
            typeOfWork: selectedCategory,
            start: beginDate,
            end: endDate,
            location: location,
            numVolunteers: 0,
            maxNumVolunteers: maxNumber,
            urgent: emergency,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Dohvati podatke iz response
        const projectId = response.data; // Ovo dohvaća podatke koje backend vraća
        console.log("Response data:", projectId);

        const formData = new FormData();
        formData.append("image", image);

        // Pošaljemo sliku na backend
        axios
          .post(
            `${BACK_URL}/organization/edit-project-picture/${projectId}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            console.log("Slika uspješno poslana, ID = " + res.data);
          })
          .catch((err) => {
            console.error("Došlo je do pogreške pri slanju slike: ", err);
          });

        //alert("Projekt uspješno registriran!");
        setLoading(false);
        navigate("/organization/home");
      } catch (err) {
        console.error(err);
      }
    } else {
      setLoading(false);
    }
  };

  const toggleEmergencyDropdown = () => {
    setEmergencyDropdownOpen(!emergencyDropdownOpen);
    setCategoryDropdownOpen(false);
  };

  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
    setEmergencyDropdownOpen(false);
  };

  const today = new Date().toISOString().split("T")[0];

  const handleBeginDateChange = (e) => {
    const selectedBeginDate = e.target.value;
    setBeginDate(selectedBeginDate);

    if (endDate && selectedBeginDate > endDate) {
      setEndDate("");
    }
  };

  const formatCategory = (cat) => {
    const categoryMap = {
      ZIVOTINJE: "ŽIVOTINJE",
      OKOLIS: "OKOLIŠ",
    };
    const mappedCategory = categoryMap[cat];
    if (mappedCategory) return mappedCategory;

    return cat;
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
              {!profilePicture ? (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center ring-4 ring-yellow-400">
                  <span className="text-gray-500">Bez slike</span>
                </div>
              ) : (
                <div>
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="rounded-lg object-cover h-80 w-full mb-4 border border-white"
                  />
                </div>
              )}
              <div>
                <input
                  type="file"
                  name="file"
                  onChange={handleImage}
                  style={{ display: "none" }} // Sakrijemo input
                  id="fileInput" // Dodajemo id za referencu
                />

                <button
                  className="mt-2 bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("fileInput").click();
                  }}
                >
                  Promijeni sliku
                </button>
              </div>

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

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="location"
                    className="text-white font-semibold"
                  >
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

                <div className="space-y-2">
                  <label className="text-white font-semibold">
                    Kategorija projekta
                  </label>
                  <div className="relative" onClick={toggleCategoryDropdown}>
                    <div className="border rounded-lg p-3 cursor-pointer bg-white text-gray-700 flex justify-between items-center">
                      <span>
                        {formatCategory(selectedCategory) ||
                          "Odaberite kategoriju"}
                      </span>
                      <img
                        src="/images/one-down-arrow.png"
                        alt="Arrow"
                        className="w-4 h-4"
                      />
                    </div>
                    {categoryDropdownOpen && (
                      <div className="absolute z-10 bg-white shadow-lg rounded-lg mt-2 w-full border max-h-60 overflow-y-auto">
                        {categories.map((category) => (
                          <div
                            key={category}
                            className="p-3 cursor-pointer hover:bg-gray-200"
                            onClick={() => {
                              if (category === "OKOLIŠ") {
                                setSelectedCategory("OKOLIS");
                              } else if (category === "ŽIVOTINJE") {
                                setSelectedCategory("ZIVOTINJE");
                              } else {
                                setSelectedCategory(category);
                              }

                              setCategoryDropdownOpen(false);
                            }}
                          >
                            {category}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.selectedCategory && (
                    <p className="text-sm text-red-500">
                      {errors.selectedCategory}
                    </p>
                  )}
                </div>
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
                    min="1"
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
                  <div className="relative" onClick={toggleEmergencyDropdown}>
                    <div className="border rounded-lg p-3 cursor-pointer bg-white text-gray-700 flex justify-between items-center">
                      <span>{emergency ? "Da" : "Ne"}</span>
                      <img
                        src="/images/one-down-arrow.png"
                        alt="Arrow"
                        className="w-4 h-4"
                      />
                    </div>
                    {emergencyDropdownOpen && (
                      <div className="absolute z-10 bg-white shadow-lg rounded-lg mt-2 w-full border">
                        <div
                          className="p-3 cursor-pointer hover:bg-gray-200 hover:rounded-t-lg"
                          onClick={() => {
                            setEmergency(true);
                            setEmergencyDropdownOpen(false);
                          }}
                        >
                          Da
                        </div>
                        <div
                          className="p-3 cursor-pointer hover:bg-gray-200 hover:rounded-b-lg"
                          onClick={() => {
                            setEmergency(false);
                            setEmergencyDropdownOpen(false);
                          }}
                        >
                          Ne
                        </div>
                      </div>
                    )}
                  </div>
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
                  disabled={isButtonDisabled}
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
                    setSelectedCategory("");
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
