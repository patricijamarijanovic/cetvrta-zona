import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../pages/assets/navBar";
import axios from "axios";




function ChooseRole() {

    const handleVolunteer = async() => {
        const urlParams = new URLSearchParams(window.location.search);
        const emailFromUrl = urlParams.get("email");

        if (emailFromUrl) {
            try {
              await axios.post("http://localhost:8080/register/volunteer/google?email="+emailFromUrl, {
              });
    
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
              await axios.post("http://localhost:8080/register/organization/google?email="+emailFromUrl, {
              });
    
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