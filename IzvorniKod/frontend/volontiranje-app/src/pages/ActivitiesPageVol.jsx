import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
//import Card from "./card";
import axios from "axios";

import NavBarLoggedInVol from "./assets/navBarVol";
import ActivitiesListAll from "./assets/activitiesListAll";
import Filter from "./assets/filter";

const BACK_URL = "http://localhost:8080";

function ActivitiesPageVol() {

    console.log("na stranici sam s aktivnostima");
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);


    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("u volonteskom home pageu");
        const token = localStorage.getItem("token");
        console.log("Tu je token!" + token);
        if (!token) {
          console.log("nema tokena!");
          navigate("/not-authorized", { replace: true });
    
          return;
        }
    
        console.log("saljem token na backend");
        axios
          .get(`${BACK_URL}/volunteer/home`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setMessage(response.data);
            console.log("Tu sam!");
          })
          .catch((error) => {
            console.log("error: ", error);
            console.error("Greška prilikom provjere tokena:", error.message); // Dodano ispisivanje glavne poruke
            if (error.response) {
              console.error("Odgovor poslužitelja:", error.response.data); // Dodano ispisivanje server response data
            }
            navigate("/not-authorized", { replace: true });
          });
      }, [navigate]);

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

    return (
        <div className="relative min-h-screen">
            <div className="bg-slate-600 rounded-b-3xl text-white">
            <NavBarLoggedInVol />
            
            <Filter setFilteredActivities={setFilteredActivities}
            setIsFiltered={setIsFiltered}/>
            </div>
            <ActivitiesListAll filteredActivities={filteredActivities}
            isFiltered={isFiltered}/>
        </div>
    );
}
   

export default ActivitiesPageVol;