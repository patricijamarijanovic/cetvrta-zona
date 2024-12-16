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
    

    return(
        <>
        <h2>Izabrei ulogu: </h2>
        <button onClick={handleVolunteer}>Volonter</button>
        <button onClick={handleOrganization}>Organizacija</button>
        </>

    );

}

export default ChooseRole;