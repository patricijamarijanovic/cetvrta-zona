import { useEffect, useState } from "react";
import Card from "./card";
import axios from "axios";
import { Link } from "react-router-dom";


// const BACK_URL = "backend-qns7.onrender.com";
// const BACK_URL = "https://backend-qns7.onrender.com";
const BACK_URL = "http://localhost:8080";

function PrevActivitiesList() {
  const token = localStorage.getItem("token");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = localStorage.getItem("role");
  console.log(role);

  useEffect(() => {
    axios.get(`${BACK_URL}/volunteer/previous-activities`,
      {
        headers:
        {
          Authorization: `Bearer ${token}` 
        },
      }
    )
      .then((response) => {
        console.log(response.data)
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Prethodne aktivnosti</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.length === 0 ? (
          <h1>Nažalost trenutačno nema aktivnosti u ovoj kategoriji :'( </h1>
        ) : (
          activities.map((activity, index) => (
            <Link to={getLink(activity.projectID)}>
            <Card
              key={index}
              title={activity.projectname}
              location={activity.projectlocation}
              dates={`From: ${activity.beginningdate} To: ${activity.enddate}`}
              organization={activity.organizationName}
              image={"/images/nekaovog.jpg"}
            />
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

export default PrevActivitiesList;
