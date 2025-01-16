import { useEffect, useState } from "react";
import Card from "./card";
import axios from "axios";
import { Link } from "react-router-dom";

// const BACK_URL = "backend-qns7.onrender.com";
// const BACK_URL = "https://backend-qns7.onrender.com";
const BACK_URL = "http://localhost:8080";

function PrevActOrg({ organizationId }) {
  const token = localStorage.getItem("token");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = localStorage.getItem("role");
  console.log(role);

  useEffect(() => {
    axios
      .get(
        `${BACK_URL}/home/organization/previous-activities/${organizationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
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

  if (loading)
    return <p className="p-8 text-gray-500">Učitavam aktivnosti...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <section className="flex flex-col mb-4">
      <h4 className="text-gray-600 font-medium mb-2">
        Prethodne aktivnosti organizacije
      </h4>
      <div>
        {activities.length === 0 ? (
          <p className="text-gray-800">
            Organizacija još nije održala niti jednu aktivnost.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, index) => (
              <Link to={getLink(activity.projectID)} key={index}>
                <Card
                  key={index}
                  title={activity.projectname}
                  location={activity.projectlocation}
                  startDate={activity.beginningdate}
                  endDate={activity.enddate}
                  organization={activity.organizationName}
                  image={"/images/nekaovog.jpg"}
                  urgency={activity.urgent}
                  category={activity.typeofwork}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default PrevActOrg;
