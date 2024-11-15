import { useEffect, useState } from "react";
import Card from "./card";
import axios from "axios";

function ActivitiesList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Dohvaćanje tokena iz localStorage
    const token = localStorage.getItem("token");

    // Ako token ne postoji, postavi grešku i prekini zahtjev
    if (!token) {
      setError("No authorization token found. Please log in.");
      setLoading(false);
      return;
    }

    axios.get("http://${BACK_URL}:8080/organization/home", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setActivities(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching activities:", err);
        setError("Error fetching activities.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-8 text-gray-500">Učitavam aktivnosti...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;
  
  return (
    <section className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity, index) => (
          <Card
            key={index}
            title={activity.projectname}
            location={activity.projectlocation}
            dates={`From: ${activity.beginningdate} To: ${activity.enddate}`}
            organization={activity.organizationName}
            image={"/images/nekaovog.jpg"}
          />
        ))}
      </div>
    </section>
  );
  
}

export default ActivitiesList;
