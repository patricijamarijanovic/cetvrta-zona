import { useEffect, useState } from "react";
import OrganizationCard from "./organizationCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";


// const BACK_URL = "backend-qns7.onrender.com";
// const BACK_URL = "https://backend-qns7.onrender.com";
const BACK_URL = "http://localhost:8080";

function OrganizationsList() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [logos, setLogos] = useState([]);
  const [orgIds, setOrgIds] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BACK_URL}/home/organizations`)
      .then((response) => {
        console.log(response.data)

        const ids = response.data.map((org) => org.organizationId);
        setOrgIds(ids); // Postavi sve ID-eve odjednom

        // Pokreni zahtjeve za sve ID-eve paralelno
        Promise.all(
          ids.map((organizationId) =>
            axios
              .get(`${BACK_URL}/home/organization/profile-picture/${organizationId}`, {
                responseType: "arraybuffer", // Ovisno o backendu, koristi arraybuffer za slike
              })
              .then((res) => {
                if (res.status === 204) {
                  return "/images/nekaovog.jpg"; // Ako nema slike, postavi default
                } else {
                  const imageBlob = new Blob([res.data], { type: "image/jpeg" });
                  const imageUrl = URL.createObjectURL(imageBlob);
                  console.log("imam sliku " + imageUrl);
                  return imageUrl; // Vrati URL slike
                }
              })
              .catch(() => "/images/nekaovog.jpg") // U slučaju greške, postavi default
          )
        )
          .then((logosArray) => {
            setLogos(logosArray); // Postavi sve logotipe odjednom
          })
          .catch((err) => {
            console.error("Error fetching logos:", err);
          });

        setOrganizations(response.data);
        setLoading(false);
        console.log("orgids: " + orgIds)
      })
      .catch((err) => {
        console.error("Error fetching organizations:", err);
        setError("Error fetching organizations.");
        setLoading(false);
      });

      

      // setOrgID(response.data[0].organizationId)

    
        // axios.get(`${BACK_URL}/home/organization/profile-picture/${organizationId}`)
        // .then((res) => {
        //   if (res.status === 204) {
        //     setLogos((prevLogos) => [...prevLogos, "/images/nekaovog.jpg"]);
        //   } else {
        //     const imageBlob = new Blob([res.data], { type: "image/jpeg" });
        //     const imageUrl = URL.createObjectURL(imageBlob);
        //     setLogos((prevLogos) => [...prevLogos, imageUrl]);
        //     console.log("imam sliku " + imageUrl)
  
        //   }
        // })
        // .catch(() => {
        //   setLogos((prevLogos) => [...prevLogos, "/images/nekaovog.jpg"]);
        // });
        
  }, []);

  
  if (loading) return <p className="p-8 text-gray-500">Učitavam organizacije...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <section className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.length === 0 ? (
          <h1>Nažalost trenutno nema prijavljenih organizacija :'( </h1>
        ) : (
          organizations.map((organization, index) => (
            <div 
              onClick={() => navigate(`/organization/profile/${organization.organizationId}`)}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            >
              <OrganizationCard
                key={index}
                OrganizationName={organization.name}
                // image={"/images/nekaovog.jpg"}
                image={logos[index]}
               // image={organization.image}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default OrganizationsList;
