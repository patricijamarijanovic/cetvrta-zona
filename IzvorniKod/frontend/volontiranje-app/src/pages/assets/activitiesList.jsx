import { useEffect, useState } from "react";
import Card from "./card";
import axios from "axios";

function ActivitiesList() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      axios.get("http://localhost:8080/activities")
        .then((response) => {
          setActivities(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Error fetching activities.");
          setLoading(false);
        });
    }, []);

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
              title={activity.title}
              organization={activity.organization}
              description={activity.description}
              image={activity.image}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default ActivitiesList;
