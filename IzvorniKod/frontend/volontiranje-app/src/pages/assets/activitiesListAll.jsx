import { useEffect, useState } from "react";
import Card from "./card";
import axios from "axios";
import { Link } from "react-router-dom";

// const BACK_URL = "backend-qns7.onrender.com";
// const BACK_URL = "https://backend-qns7.onrender.com";
const BACK_URL = "http://localhost:8080";

function ActivitiesListAll({ filteredActivities, isFiltered }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = localStorage.getItem("role");
  const [pics, setPics] = useState([]);

  useEffect(() => {
    if (isFiltered && filteredActivities.length > 0) {
      // Ako postoje filtrirane aktivnosti, postavi ih
      setActivities(filteredActivities);
      // setPics(new Array(filteredActivities.length).fill("/images/nekaovog.jpg")); // Default slike za filtrirane aktivnosti

      const ids = filteredActivities.map((org) => org.projectID);
      // Pokreni zahtjeve za slike
      Promise.all(
        ids.map((projectId) =>
          axios
            .get(`${BACK_URL}/home/project-picture/${projectId}`, {
              responseType: "arraybuffer",
            })
            .then((res) => {
              if (res.status === 204) {
                return "/images/nekaovog.jpg";
              } else {
                const imageBlob = new Blob([res.data], { type: "image/jpeg" });
                const imageUrl = URL.createObjectURL(imageBlob);
                return imageUrl;
              }
            })
            .catch(() => "/images/nekaovog.jpg")
        )
      )
        .then((logosArray) => {
          setPics(logosArray);
        })
        .catch((err) => {
          console.error("Error fetching logos:", err);
        });

      setLoading(false);
    } else if (isFiltered && filteredActivities.length === 0) {
      // Ako je filtriranje prazno, postavi activities na prazno polje

      setActivities([]);
      setLoading(false);
      console.log(filteredActivities);
    } else {
      // Ako nema filtriranih aktivnosti, dohvaćaj sve aktivnosti
      axios
        .get(`${BACK_URL}/home`)
        .then((response) => {
          const ids = response.data.map((org) => org.projectID);

          // Pokreni zahtjeve za slike
          Promise.all(
            ids.map((projectId) =>
              axios
                .get(`${BACK_URL}/home/project-picture/${projectId}`, {
                  responseType: "arraybuffer",
                })
                .then((res) => {
                  if (res.status === 204) {
                    return "/images/nekaovog.jpg";
                  } else {
                    const imageBlob = new Blob([res.data], {
                      type: "image/jpeg",
                    });
                    const imageUrl = URL.createObjectURL(imageBlob);
                    return imageUrl;
                  }
                })
                .catch(() => "/images/nekaovog.jpg")
            )
          )
            .then((logosArray) => {
              setPics(logosArray);
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
    }
  }, [filteredActivities]);

  const getLink = (activityId) => {
    if (role === "ROLE_ORGANIZATION") {
      return `/organization/activity/${activityId}`;
    } else if (role === "ROLE_VOLUNTEER") {
      return `/volunteer/activity/${activityId}`;
    } else {
      return `/activity/${activityId}`;
    }
  };

  if (loading)
    return <p className="p-8 text-gray-500">Učitavam aktivnosti...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <section className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.length === 0 ? (
          <h1>Nažalost trenutno nema dostupnih aktivnosti :'( </h1>
        ) : (
          activities.map((activity, index) => (
            <Link to={getLink(activity.projectID)} key={index}>
              <Card
                key={index}
                title={activity.projectname}
                location={activity.projectlocation}
                startDate={activity.beginningdate}
                endDate={activity.enddate}
                organization={activity.organizationName}
                image={pics[index]}
                urgency={activity.urgent}
                category={activity.typeofwork}
              />
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

export default ActivitiesListAll;
