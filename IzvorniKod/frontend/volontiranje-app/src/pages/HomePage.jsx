import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "./assets/navBar";
import Motivation from "./assets/motivation";
import ActivitiesList from "./assets/activitiesList";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Tu je token!!" + token);
    if (token) {
      // navigate('/not-authorized', { replace: true });

      return;
    }
  }, [navigate]);

  return (
    <div className="relative min-h-screen">
      <div className="bg-slate-600 rounded-b-3xl text-white">
        <NavBar />
        <Motivation />
      </div>
      <ActivitiesList />
    </div>
  );
}

export default HomePage;
