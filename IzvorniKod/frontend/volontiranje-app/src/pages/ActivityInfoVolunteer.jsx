import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "./assets/navBar";
import { useParams } from "react-router-dom";
import axios from "axios";

// const BACK_URL = "backend-qns7.onrender.com";
// const BACK_URL = "https://backend-qns7.onrender.com";
const BACK_URL = "http://localhost:8080";



function ActivityInfoVolunteer() {
    const {id} = useParams();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    console.log(token);

    useEffect(() => {
        axios.get(`${BACK_URL}/volunteer/activity/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
            console.log(response.data)
            setActivity(response.data);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error fetching activities:", err);
            //setError("Error fetching activities.");
            setLoading(false);
          });
      }, []);
    
      if(loading) return <p className="p-8 text-gray-500">Učitavam aktivnosti...</p>;

      if(activity.urgent == false) {
        activity.hitno = "NE";
      } else {
        activity.hitno = "DA";
      }




    return (
        <>
        <div className="bg-slate-600 rounded-b-3xl text-white">
        <NavBar></NavBar>
        </div>
        
        
         <h1>{activity.projectname}</h1>
         <p>{activity.projectdesc}</p>
         <p>Organizacija: {activity.organizationName}</p>
         <p>Email: {activity.organizationEmail}</p>
         <p>Početak: {activity.beginningdate}</p>
         <p>Kraj: {activity.enddate}</p>
         <p>Lokacija: {activity.projectlocation}</p>
         <p>Potreban broj volontera: {activity.maxnumvolunteers}</p>
         <p>Hitno: {activity.hitno}</p>
         <p>Kategorija: {activity.typeofwork}</p>
         
        </>
    );
}

export default ActivityInfoVolunteer;