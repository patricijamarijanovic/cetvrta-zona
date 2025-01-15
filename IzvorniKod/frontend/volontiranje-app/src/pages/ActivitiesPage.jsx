import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
//import Card from "./card";
import axios from "axios";
import Filter from "./assets/filter";

import NavBar from "./assets/navBar"
import ActivitiesListAll from "./assets/activitiesListAll";

const BACK_URL = "http://localhost:8080";

function ActivitiesPage() {

    console.log("na stranici sam s aktivnostima");
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);

    const [error, setError] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFilteredActivities = async () => {
            const savedFilters = localStorage.getItem("filters");
    
            if (savedFilters) {
                const filterData = JSON.parse(savedFilters);
                console.log("TU");
                console.log(filterData);
                setIsFiltered(true);
    
                try {
                    const response = await axios.post(
                        `${BACK_URL}/home/activities/filter`,
                        {
                            typeOfWork: filterData.typeofwork,
                            projectLocation: filterData.location,
                            startDate: filterData.startDate,
                            endDate: filterData.enddate,
                        }
                    );
                    console.log("USPJESNO FILTRIRANJE!!");
                    console.log("U FILTERU ");
                    console.log(response.data);
    
                    setFilteredActivities(response.data);
                } catch (error) {
                    console.error("Error updating activity:", error);
                    setError("Došlo je do greške pri dohvaćanju aktivnosti.");
                }
            }
        };
    
        fetchFilteredActivities();
    }, []);

      const handleClearFilters = () => {
        localStorage.removeItem("filters"); // Ukloni spremljene filtere
        setFilteredActivities([]);
        setIsFiltered(false);
      };
      

    return (
        <div className="relative min-h-screen">
            <div className="bg-slate-600 rounded-b-3xl text-white">
            <NavBar />
            <Filter setFilteredActivities={setFilteredActivities}
            setIsFiltered={setIsFiltered}/>
            <button onClick={handleClearFilters}>Poništi</button>
            </div>
            <ActivitiesListAll filteredActivities={filteredActivities}
            isFiltered={isFiltered}/>
        </div>
        );
    }

export default ActivitiesPage;