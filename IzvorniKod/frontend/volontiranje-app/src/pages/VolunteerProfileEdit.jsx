import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBarLoggedIn from "./assets/navBarVol"; // Adjust path based on your structure

const BACK_URL = "http://localhost:8080"; // Update with your backend URL

const interestsMap = {
  DJECA: "Djeca",
  INVALIDI: "Invalidi",
  STARIJI: "Stariji",
  SPORT: "Sport",
  ZIVOTINJE: "Životinje",
  EDUKACIJA: "Edukacija",
  ZDRAVLJE: "Zdravlje",
  OKOLIS: "Okoliš",
  OSTALO: "Ostalo",
};

const skillsMap = {
  ENGLESKI: "Engleski",
  NJEMACKI: "Njemački",
  OSTALI_JEZICI: "Ostali jezici",
  ADMINISTRATIVNI_POSLOVI: "Administrativni poslovi",
  PODUCAVANJE: "Podučavanje",
  FIZICKI_POSLOVI: "Fizički poslovi",
  RUKOTVORINE: "Rukotvorine",
  GLAZBENA_UMJETNOST: "Glazbena umjetnost",
  FOTOGRAFIJA: "Fotografija",
  VIDEO: "Video",
  DIZAJN: "Dizajn",
  KREATIVNI_POSLOVI: "Kreativni poslovi",
  RACUNOVODSTVO: "Računovodstvo",
};

function VolunteerProfileEdit() {
  const [profileData, setProfileData] = useState({
    profilePicture: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    location: "",
    phone: "",
    email: "",
    interests: [],
    skills: [],
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [image, setImage] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  function handleImage(e) {
    setImage(e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfilePicture(imageURL);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/volunteer/not-authorized ", { replace: true });
      return;
    }

    axios
      .get(`${BACK_URL}/volunteer/profile-picture`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "arraybuffer",
      })
      .then((res) => {
        if (res.status === 204) {
          setProfilePicture("/images/nekaovog.jpg");
        } else {
          const imageBlob = new Blob([res.data], { type: "image/jpeg" });
          const imageUrl = URL.createObjectURL(imageBlob);
          setProfilePicture(imageUrl);
        }
      })
      .catch(() => {
        setProfilePicture("/images/nekaovog.jpg");
      });

    axios
      .get(`${BACK_URL}/volunteer/my-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProfileData(response.data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("Failed to load profile data. Please try again later.");
        navigate("/not-authorized", { replace: true });
        setLoading(false);
      });
  }, [navigate]);

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    setMessage("");
  };

  const handleSaveAll = () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", image);

    axios
      .post(`${BACK_URL}/volunteer/edit-picture`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => console.error("Error uploading picture: ", err));

    axios
      .post(`${BACK_URL}/volunteer/edit-profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setIsEditMode(false);
        setMessage("Profile updated successfully!");
      })
      .catch(() => {
        setMessage("Failed to update profile. Please try again.");
      });
  };

  const handleChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, value) => {
    setProfileData((prev) => {
      const updatedList = prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value];
      return { ...prev, [field]: updatedList };
    });
  };

  const renderCheckboxSection = (label, field, map) => (
    <div className="flex flex-col mb-4">
      <h4 className="text-gray-600 font-medium mb-2">{label}</h4>
      {isEditMode ? (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(map).map(([key, value]) => (
            <label key={key} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={profileData[field].includes(key)}
                onChange={() => handleCheckboxChange(field, key)}
                className="mr-2"
              />
              {value}
            </label>
          ))}
        </div>
      ) : (
        <div>
          {profileData[field].map((item) => (
            <span
              key={item}
              className="inline-block bg-yellow-400 text-black px-2 py-1 rounded-full mr-2 mb-2"
            >
              {map[item]}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const renderField = (label, field, type = "text") => (
    <div className="flex flex-col mb-4">
      <h4 className="text-gray-600 font-medium">{label}</h4>
      {isEditMode ? (
        <input
          type={type}
          value={profileData[field] || ""}
          onChange={(e) => handleChange(field, e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      ) : (
        <p className="text-gray-800">{profileData[field] || "Nije navedeno"}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="bg-slate-700 min-h-screen flex items-center justify-center">
        <p className="text-white text-lg">Učitavanje...</p>
      </div>
    );
  }
 
  return (
    <div className="bg-slate-700 min-h-screen">
      <NavBarLoggedIn />
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white shadow-md rounded p-6 max-w-3xl w-full mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">Profil Volontera</h1>

          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center ring-4 ring-yellow-400">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="rounded-full w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">Nema slike</span>
              )}
            </div>
            {isEditMode && (
              <div>
                <input
                  type="file"
                  name="file"
                  onChange={handleImage}
                  style={{ display: "none" }}
                  id="fileInput"
                />

                <button
                  className="mt-2 bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  Promijeni sliku
                </button>
              </div>
            )}
          </div>

          {/* Editable Fields */}
          {renderField("Ime", "firstName")}
          {renderField("Prezime", "lastName")}
          {renderField("Datum rođenja", "dateOfBirth", "date")}
          {renderField("Email adresa", "email")}
          {renderField("Lokacija", "location")}
          {renderField("Broj telefona", "phone")}

          {/* Interests Section */}
          {renderCheckboxSection("Interesi", "interests", interestsMap)}

          {/* Skills Section */}
          {renderCheckboxSection("Vještine", "skills", skillsMap)}

          {/* Feedback Message */}
          {message && (
            <p
              className={`text-center mt-4 ${
                message.includes("successfully")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          {/* Edit/Save All Button */}
          <div className="text-center mt-6">
            {isEditMode ? (
              <button
                onClick={handleSaveAll}
                className="bg-yellow-400 px-6 py-3 text-lg rounded hover:bg-yellow-500"
              >
                Spremi podatke
              </button>
            ) : (
              <button
                onClick={handleEditToggle}
                className="bg-yellow-400 px-6 py-3 text-lg rounded hover:bg-yellow-500"
              >
                Uredi podatke
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VolunteerProfileEdit;
