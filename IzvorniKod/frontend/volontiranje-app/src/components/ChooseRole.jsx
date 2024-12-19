import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../pages/assets/navBar";
import axios from "axios";




function ChooseRole() {
    const navigate = useNavigate();

    const handleVolunteer = async() => {
        const urlParams = new URLSearchParams(window.location.search);
        const emailFromUrl = urlParams.get("email");
       

        if (emailFromUrl) {
            try {
              const token = await axios.post("http://localhost:8080/register/volunteer/google?email="+emailFromUrl, {
              });

              if (token) {
                console.log("Token:", JSON.stringify(token.data.jwt)); // Ispiši token u konzolu
                console.log("Role: ", JSON.stringify(token.data.role));
      
                //alert("Token: " +  JSON.stringif(decoded.role)); // Prikaži token u alertu
                // Spremi token u localStorage ako trebaš
                localStorage.setItem("token", token.data.jwt);
                localStorage.setItem("role", token.data.role);
      
                if (token.data.role == "ROLE_VOLUNTEER") {
                  navigate("/volunteer/home");
                } else if (token.data.role == "ROLE_ORGANIZATION") {
                  navigate("/organization/home");
                } else if (token.data.role == "ROLE_ADMIN") {
                  navigate("/admin/home");
                }
              } else {
                alert("Nema tokena u odgovoru.");
              }
    
            } catch (error) {
              console.error("Greška prilikom slanja zahtjeva:", error);
            }
          } else {
            alert("E-mail nije pronađen u URL-u.");
          }
    }

    const handleOrganization = async() => {
        const urlParams = new URLSearchParams(window.location.search);
        const emailFromUrl = urlParams.get("email");

        if (emailFromUrl) {
            try {
              const token = await axios.post("http://localhost:8080/register/organization/google?email="+emailFromUrl, {
              });

              if (token) {
                console.log("Token:", JSON.stringify(token.data.jwt)); // Ispiši token u konzolu
                console.log("Role: ", JSON.stringify(token.data.role));

                //alert("Token: " +  JSON.stringif(decoded.role)); // Prikaži token u alertu
                // Spremi token u localStorage ako trebaš
                localStorage.setItem("token", token.data.jwt);
                localStorage.setItem("role", token.data.role);
      
                if (token.data.role == "ROLE_VOLUNTEER") {
                  navigate("/volunteer/home");
                } else if (token.data.role == "ROLE_ORGANIZATION") {
                  navigate("/organization/home");
                } else if (token.data.role == "ROLE_ADMIN") {
                  navigate("/admin/home");
                }
              } else {
                alert("Nema tokena u odgovoru.");
              }
    
            } catch (error) {
              console.error("Greška prilikom slanja zahtjeva:", error);
            }
          } else {
            alert("E-mail nije pronađen u URL-u.");
          }
    }

    return (
      <>
        <div className="bg-slate-600 rounded-b-3xl text-white">
          <NavBar />
        </div>
  
        <div className="min-h-screen bg-white">
          <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-yellow-500">Izaberi</span> ulogu:
              </h1>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
  
              <div className="bg-slate-600 shadow-lg hover:shadow-xl transition-shadow p-6 rounded-xl">
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">
                    VOLONTER
                  </h1>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleVolunteer}
                    className="bg-yellow-300 text-black text-xl py-2 px-4 rounded-s-3xl rounded-e-3xl hover:bg-yellow-400"
                  >
                    ODABERI
                  </button>
                </div>
              </div>
  
              <div className="bg-slate-600 shadow-lg hover:shadow-xl transition-shadow p-6 rounded-xl">
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">
                    ORGANIZACIJA
                  </h1>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleOrganization}
                    className="bg-yellow-300 text-black text-xl py-2 px-4 rounded-s-3xl rounded-e-3xl hover:bg-yellow-400"
                  >
                    ODABERI
                  </button>
                </div>
              </div>
  
            </div>
          </div>
        </div>
      </>
    );
}

export default ChooseRole;