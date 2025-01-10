
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBarLoggedIn from "./assets/navBarOrg";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from "./assets/card";

// const BACK_URL = "backend-qns7.onrender.com";
// const BACK_URL = "https://backend-qns7.onrender.com";
const BACK_URL = "http://localhost:8080";

function ActivityInfoOrganization() {
    const {id} = useParams();
    const [activity, setActivity] = useState(null);

    const token = localStorage.getItem("token");
    const [volunteers, setVolunteers] = useState([]);
    const [loadingActivity, setLoadingActivity] = useState(true);
    const [loadingVolunteers, setLoadingVolunteers] = useState(true);

    useEffect(() => {
        axios.get(`${BACK_URL}/home/activity/${id}`)
          .then((response) => {
            console.log(response.data)
            setActivity(response.data);
            setLoadingActivity(false);
       
          })
          .catch((err) => {
            console.error("Error fetching activities:", err);
            //setError("Error fetching activities.");
            setLoadingActivity(false);
          });
      }, []);


      useEffect(() => {
        axios.get(`${BACK_URL}/organization/applications/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            console.log(response.data)
           
            setVolunteers(response.data);
            setLoadingVolunteers(false);
           
          })
          .catch((err) => {
            console.error("Error fetching activities:", err);
            //setError("Error fetching activities.");
           
            setLoadingVolunteers(false);
          });
      }, []);
    
      if (loadingActivity || loadingVolunteers) {
        return <p className="p-8 text-gray-500">Učitavam podatke...</p>;
    }
      if (!activity) { 
        return <p className="p-8 text-gray-500">Nema podataka o aktivnosti.</p>;
    }

    if(activity.urgent == false) {
      activity.hitno = "NE";
    } else {
      activity.hitno = "DA";
    }

    const handleAccept = async (volunteerId) => {
        console.log(volunteerId)
        axios.put(`${BACK_URL}/organization/applications/${id}/accept/${volunteerId}`, {},{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            console.log(response.data)
            window.location.reload();

            
           
          })
          .catch((err) => {
            console.error("Error fetching activities:", err);
            //setError("Error fetching activities.");
           
            
          });
      
    }

    const handleReject = async (volunteerId) => {
      axios.put(`${BACK_URL}/organization/applications/${id}/reject/${volunteerId}`, {},{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log(response.data)
          window.location.reload();

          
         
        })
        .catch((err) => {
          console.error("Error fetching activities:", err);
          //setError("Error fetching activities.");
         
          
        });
    }

    return (
        <>
        <div className="bg-slate-600 rounded-b-3xl text-white">
        <NavBarLoggedIn></NavBarLoggedIn>
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

         <div>
  {volunteers.length === 0 ? (
    <h1>Nažalost trenutačno nema prijavljenih volontera. </h1>
  ) : (
    volunteers.map((volunteer, index) => (
      <div 
        key={index} 
        style={{ 
          display: "flex", 
          alignItems: "center" 
        }}
      >
        <div style={{ display: "flex", gap: "5px" }}> {/* Ime i prezime bliže */}
          <p>{volunteer.firstName}</p>
          <p>{volunteer.lastName}</p>
        </div>
        <div style={{ marginLeft: "20px", display: "flex", gap: "10px" }}>
          {volunteer.status === "ACCEPTED" ? (
            <p>Prihvaćen</p>
          ) : (
            <>
              <button onClick={() => handleAccept(volunteer.volunteerId)}>Accept</button>
              <button onClick={() => handleReject(volunteer.volunteerId)}>Reject</button>
            </>
          )}
        </div>
      </div>
    ))
  )}
</div>


         
        </>
    );
}

export default ActivityInfoOrganization;