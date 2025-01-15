import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BACK_URL } from "../config";
import NavBarLoggedIn from "../components/NavBarLoggedIn";
import NavBarLoggedInVol from "../components/NavBarLoggedInVol";

function VolunteerProfilePage() {
  const { volunteerId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileRes = await axios.get(`${BACK_URL}/home/profile-vol/${volunteerId}`);
        setProfileData(profileRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Error loading profile. Please try again.");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [volunteerId]);

  return (
    <div className="bg-slate-700 min-h-screen">
      <div className="bg-slate-600 rounded-b-3xl text-white">
        {userRole === "ROLE_ORGANIZATION" ? <NavBarLoggedIn /> : <NavBarLoggedInVol />}
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white shadow-md rounded p-6 max-w-3xl w-full mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">Profil Volontera</h1>

          {renderField("Ime", profileData?.firstName)}
          {renderField("Prezime", profileData?.lastName)}
          {renderField("Datum rođenja", profileData?.dateOfBirth)}
          {renderField("Email adresa", profileData?.email)}
          {renderField("Lokacija", profileData?.location)}
          {renderField("Broj telefona", profileData?.phone)}

          {renderTagSection("Interesi", profileData?.interests, interestsMap)}
          {renderTagSection("Vještine", profileData?.skills, skillsMap)}
        </div>
      </div>
    </div>
  );
}

export default VolunteerProfilePage; 