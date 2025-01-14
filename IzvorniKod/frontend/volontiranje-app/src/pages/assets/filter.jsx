import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
  

// const BACK_URL = "backend-qns7.onrender.com";
// const BACK_URL = "https://backend-qns7.onrender.com";
const BACK_URL = "http://localhost:8080";


function Filter() {
    const token = localStorage.getItem("token");
    const categories = [
        "DJECA",
        "INVALIDI",
        "STARIJI",
        "SPORT",
        "ŽIVOTINJE",
        "EDUKACIJA",
        "ZDRAVLJE",
        "OKOLIŠ",
        "OSTALO",
      ];
    const [filterData, setFilterData] = useState({
        location: null,
        typeofwork: null,
        startDate: null,
        enddate: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilterData({ ...filterData, [name]: value });
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (filterData.typeofwork === "OKOLIŠ") {
            filterData.typeofwork = "OKOLIS";
          }
          if (filterData.typeofwork === "ŽIVOTINJE") {
            filterData.typeofwork = "ZIVOTINJE";
          }

          console.log(filterData)
      
          try {
            const response = await axios.post(
              `${BACK_URL}/home/activities/filter`,
              { 
                typeOfWork: filterData.typeofwork,
                projectLocation: filterData.location,
                startDate: filterData.startDate,
                endDate: filterData.enddate,},
               
            );
            console.log("USPJESNO FILTRIRANJE!!");
            console.log(response)
          
            //window.location.reload();
          } catch (error) {
            console.error("Error updating activity:", error);
          }
    }



    return(<>
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>
          {/* Lokacija */}
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="location" style={{ display: "block", marginBottom: "5px" }}>
              Lokacija:
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={filterData.location}
              onChange={handleChange}
              placeholder="Unesite lokaciju"
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          {/* Kategorija */}
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="typeofwork" style={{ display: "block", marginBottom: "5px" }}>
              Kategorija:
            </label>
            <select
              id="typeofwork"
              name="typeofwork"
              value={filterData.typeofwork}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            >
              <option value="">Odaberite kategoriju</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Početni datum */}
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="begindate" style={{ display: "block", marginBottom: "5px" }}>
              Početni datum:
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filterData.startDate}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          {/* Završni datum */}
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="enddate" style={{ display: "block", marginBottom: "5px" }}>
              Završni datum:
            </label>
            <input
              type="date"
              id="enddate"
              name="enddate"
              value={filterData.enddate}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          {/* Gumb za filtriranje */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Filtriraj
          </button>
        </form>
      </div>
    </>);
}

export default Filter;