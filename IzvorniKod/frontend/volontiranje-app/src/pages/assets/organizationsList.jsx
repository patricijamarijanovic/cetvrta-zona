import { useEffect, useState } from "react";
import OrganizationCard from "./organizationCard";
import axios from "axios";


// const BACK_URL = "backend-qns7.onrender.com";
// const BACK_URL = "https://backend-qns7.onrender.com";
const BACK_URL = "http://localhost:8080";

function OrganizationsList() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${BACK_URL}/home/organizations`)
      .then((response) => {
        console.log(response.data)
        setOrganizations(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching organizations:", err);
        setError("Error fetching organizations.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-8 text-gray-500">Učitavam organizacije...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <section className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.length === 0 ? (
          <h1>Nažalost trenutačno nema prijavljenih organizacija :'( </h1>
        ) : (
          organizations.map((organization, index) => (
            <OrganizationCard
              key={index}
              OrganizationName={organization.name}
              image={"/images/nekaovog.jpg"}
             // image={organization.image}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default OrganizationsList;
