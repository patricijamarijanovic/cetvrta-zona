import { useEffect, useState } from "react";
import Card from "./card";
import axios from "axios";

function ActivitiesList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/home")
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

  if (loading) return <p className="p-8 text-gray-500">Loading activities...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Aktualno</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.length === 0 ? (
          <h1>Na žalost trenutno nema dostupnih aktivnosti :'( </h1>
        ) : (
          activities.map((activity, index) => (
            <Card
              key={index}
              title={activity.projectname}
              location={activity.projectlocation}
              dates={`From: ${activity.beginningdate} To: ${activity.enddate}`}
              organization={activity.organizationName}
              image={"/images/dog.jpg"}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default ActivitiesList;
