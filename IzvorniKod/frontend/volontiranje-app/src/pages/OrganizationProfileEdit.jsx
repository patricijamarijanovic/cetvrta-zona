import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBarLoggedIn from "./assets/navBarOrg";

const BACK_URL = "http://localhost:8080";

const areasOfWorkMap = {
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

function OrganizationProfileEdit() {
  const [profileData, setProfileData] = useState({
    name: "",
    description: "",
    areas_of_work: [],
    email: "",
    organizationId: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [image, setImage] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  function handleImage(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const imageURL = URL.createObjectURL(file);
      setProfilePicture(imageURL);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/not-authorized", { replace: true });
      return;
    }

    axios
      .get(`${BACK_URL}/organization/profile-picture`, {
        headers: { Authorization: `Bearer ${token}` },
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
      .get(`${BACK_URL}/organization/my-profile`, {
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
    if (!profileData.name || !profileData.email) {
      setMessage("Naziv organizacije i email adresa su obavezni.");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", image);

    axios
      .post(`${BACK_URL}/organization/edit-picture`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((err) => console.error("Error uploading picture: ", err));

    axios
      .post(`${BACK_URL}/organization/edit-profile`, profileData, {
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

  const renderField = (label, field, type = "text", readOnly = false) => (
    <div className="flex flex-col mb-4">
      <h4 className="text-gray-600 font-medium">{label}</h4>
      {isEditMode && !readOnly ? (
        <input
          type={type}
          value={profileData[field] || ""}
          onChange={(e) =>
            setProfileData((prev) => ({ ...prev, [field]: e.target.value }))
          }
          className="border rounded px-2 py-1 w-full"
        />
      ) : (
        <p className="text-gray-800">{profileData[field] || "Nije navedeno"}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="bg-slate-700 min-h-screen flex items-center justify-center text-white">
        <p>Učitavanje...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-700 min-h-screen">
      <NavBarLoggedIn />
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white shadow-md rounded p-6 max-w-3xl w-full mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">Profil Organizacije</h1>

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

          {renderField("Naziv organizacije", "name")}
          {renderField("Email adresa", "email", "text", true)}
          {renderField("Opis", "description")}
          {renderCheckboxSection("Područja rada", "areas_of_work", areasOfWorkMap)}

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

export default OrganizationProfileEdit;
