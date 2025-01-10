import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBarLoggedIn from "./assets/navBarVol"; // Adjust path based on your structure

const BACK_URL = "http://localhost:8080"; // Update with your backend URL

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/not-authorized", { replace: true });
      return;
    }

    axios
      .get(`${BACK_URL}/volunteer/my-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProfileData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile data:", err);
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
    axios
      .post(
        `${BACK_URL}/volunteer/edit-profile`,
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setIsEditMode(false);
        setMessage("Profile updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        setMessage("Failed to update profile. Please try again.");
      });
  };

  const handleChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

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
      <div className="bg-slate-700 min-h-screen flex items-center justify-center text-white">
        <p>Loading profile data...</p>
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
              {profileData.profilePicture ? (
                <img
                  src={profileData.profilePicture}
                  alt="Profile"
                  className="rounded-full w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </div>
            {isEditMode && (
              <button className="mt-2 bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500">
                Promijeni sliku
              </button>
            )}
          </div>

          {/* Editable Fields */}
          {renderField("Ime", "firstName")}
          {renderField("Prezime", "lastName")}
          {renderField("Datum rođenja", "dateOfBirth", "date")}
          {renderField("Email adresa", "email")}
          {renderField("Lokacija", "location")}
          {renderField("Broj telefona", "phone")}

          {/* Interests and Skills */}
          {renderField("Interesi", "interests")}
          {renderField("Vještine", "skills")}

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
