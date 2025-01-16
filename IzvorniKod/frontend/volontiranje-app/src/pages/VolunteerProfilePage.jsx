import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBarLoggedIn from "./assets/navBarOrg";
import NavBarLoggedInVol from "./assets/navBarVol";

import PrevActProfile from "./assets/prevActProfile";
import InProgressActProfile from "./assets/inProgressActProfile";

const BACK_URL = "http://localhost:8080";

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

function VolunteerProfilePage() {
  const { volunteerId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [image, setImage] = useState("");

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

  useEffect(() => {
    axios
        .get(`${BACK_URL}/home/volunteer/profile-picture/${volunteerId}`, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          if (res.status === 204) {
            setImage("/images/profilna.jpg"); // Ako nema slike, postavi zadanu
          } else {
            const imageBlob = new Blob([res.data], { type: "image/jpeg" });
            const imageUrl = URL.createObjectURL(imageBlob);
            setImage(imageUrl); // Postavi URL slike
          }
        })
        .catch(() => {
          setImage("/images/profilna.jpg"); // U slučaju greške, postavi zadanu sliku
        });
  }, [volunteerId])

  const renderField = (label, value) => (
    <div className="flex flex-col mb-4">
      <h4 className="text-gray-600 font-medium">{label}</h4>
      <p className="text-gray-800">{value || "Nije navedeno"}</p>
    </div>
  );

  const renderTagSection = (label, items, map) => (
    <div className="flex flex-col mb-4">
      <h4 className="text-gray-600 font-medium mb-2">{label}</h4>
      <div>
        {items?.map((item) => (
          <span
            key={item}
            className="inline-block bg-yellow-400 text-black px-2 py-1 rounded-full mr-2 mb-2"
          >
            {map[item]}
          </span>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="bg-slate-600 rounded-b-3xl text-white">
          {userRole === "ROLE_ORGANIZATION" ? <NavBarLoggedIn /> : <NavBarLoggedInVol />}
        </div>
        <div className="flex items-center justify-center text-gray-500 mt-8">
          <p>Učitavanje profila...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="bg-slate-600 rounded-b-3xl text-white">
          {userRole === "ROLE_ORGANIZATION" ? <NavBarLoggedIn /> : <NavBarLoggedInVol />}
        </div>
        <div className="flex items-center justify-center text-red-500 mt-8">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-700 min-h-screen">
      <div className="bg-slate-600 rounded-b-3xl text-white">
        {userRole === "ROLE_ORGANIZATION" ? <NavBarLoggedIn /> : <NavBarLoggedInVol />}
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white shadow-md rounded p-6 max-w-3xl w-full mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">Profil Volontera</h1>

          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center ring-4 ring-yellow-400">
              <img
                src={image || "/images/default.jpg"}
                alt="Profile"
                className="rounded-full w-full h-full object-cover"
              />
            </div>
          </div>

          {renderField("Ime", profileData?.firstName)}
          {renderField("Prezime", profileData?.lastName)}
          {renderField("Datum rođenja", profileData?.dateOfBirth)}
          {renderField("Email adresa", profileData?.email)}
          {renderField("Lokacija", profileData?.location)}
          {renderField("Broj telefona", profileData?.phone)}

          {renderTagSection("Interesi", profileData?.interests, interestsMap)}
          {renderTagSection("Vještine", profileData?.skills, skillsMap)}

          <PrevActProfile volunteerID = {volunteerId}/>
          <InProgressActProfile volunteerID = {volunteerId}/>
        </div>
      </div>
    </div>
  );
}

export default VolunteerProfilePage; 