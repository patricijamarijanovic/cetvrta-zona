import { useEffect, useState } from "react";
import Card from "./card";
import axios from "axios";
import { Link } from "react-router-dom";


// const BACK_URL = "backend-qns7.onrender.com";
// const BACK_URL = "https://backend-qns7.onrender.com";
const BACK_URL = "http://localhost:8080";

function ActivitiesList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = localStorage.getItem("role");
  console.log(role);

  const [pics, setPics] = useState([]);

  useEffect(() => {
    axios.get(`${BACK_URL}/home/recent-activities`)
      .then((response) => {
        console.log(response.data)

        const ids = response.data.map((org) => org.projectID);
        console.log("ids: " + ids)

        // Pokreni zahtjeve za sve ID-eve paralelno
        Promise.all(
          ids.map((projectId) =>
            axios
              .get(`${BACK_URL}/home/project-picture/${projectId}`, {
                responseType: "arraybuffer", // Ovisno o backendu, koristi arraybuffer za slike
              })
              .then((res) => {
                if (res.status === 204) {
                  return "/images/nekaovog2.jpg"; // Ako nema slike, postavi default
                } else {
                  const imageBlob = new Blob([res.data], { type: "image/jpeg" });
                  const imageUrl = URL.createObjectURL(imageBlob);
                  console.log("imam sliku!! " + imageUrl);
                  return imageUrl; // Vrati URL slike
                }
              })
              .catch(() => "/images/nekaovog2.jpg") // U slučaju greške, postavi default
          )
        )
          .then((logosArray) => {
            setPics(logosArray); // Postavi sve logotipe odjednom
          })
          .catch((err) => {
            console.error("Error fetching logos:", err);
          });

        setActivities(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching activities:", err);
        setError("Error fetching activities.");
        setLoading(false);
      });
  }, []);

  const getLink = (activityId) => {
    if (role === "ROLE_ORGANIZATION") {
        return `/organization/activity/${activityId}`;
    } else if (role === "ROLE_VOLUNTEER") {
        return `/volunteer/activity/${activityId}`;
    } else {
        return `/activity/${activityId}`; // Defaultni link ako nema role
    }
};

  if (loading) return <p className="p-8 text-gray-500">Učitavam aktivnosti...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Aktualno</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.length === 0 ? (
          <h1>Nažalost trenutačno nema dostupnih aktivnosti :'( </h1>
        ) : (
          activities.map((activity, index) => (
            <Link to={getLink(activity.projectID)}>
            <Card
              key={index}
              title={activity.projectname}
              location={activity.projectlocation}
              dates={`From: ${activity.beginningdate} To: ${activity.enddate}`}
              organization={activity.organizationName}
              image={pics[index]}
            />
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

export default ActivitiesList;
