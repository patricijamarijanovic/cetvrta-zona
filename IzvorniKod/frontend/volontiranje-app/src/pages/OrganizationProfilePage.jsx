import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBarLoggedIn from "./assets/navBarOrg";
import NavBarLoggedInVol from "./assets/navBarVol";
import NavBar from "./assets/navBar";

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

function OrganizationProfilePage() {
  const { organizationId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const token = localStorage.getItem("token");
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileRes = await axios.get(`${BACK_URL}/home/profile/${organizationId}`);
        setProfileData(profileRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Error loading profile. Please try again.");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [organizationId]);

  useEffect(() => {
    axios
        .get(`${BACK_URL}/home/organization/profile-picture/${organizationId}`, {
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
  }, [organizationId])

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

  const renderNavBar = () => {
    if (!token) return <NavBar />;
    return userRole === "ROLE_ORGANIZATION" ? <NavBarLoggedIn /> : <NavBarLoggedInVol />;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="bg-slate-600 rounded-b-3xl text-white">
          {renderNavBar()}
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
          {renderNavBar()}
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
        {renderNavBar()}
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white shadow-md rounded p-6 max-w-3xl w-full mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">Profil Organizacije</h1>

          <img
           src={image}
           className="rounded-lg object-cover h-80 w-full mb-4 border border-black"
         />

          {renderField("Naziv organizacije", profileData?.name)}
          {renderField("Email adresa", profileData?.email)}
          {renderField("Opis", profileData?.description)}
          {renderTagSection("Područja rada", profileData?.areas_of_work, areasOfWorkMap)}
        </div>
      </div>
    </div>
  );
}

export default OrganizationProfilePage; 