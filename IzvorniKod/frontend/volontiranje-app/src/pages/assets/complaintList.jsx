
import { useEffect, useState } from "react";
import Card from "./card";
import axios from "axios";
import { Link } from "react-router-dom";
import ComplaintCard from "./complaintCard";

// const BACK_URL = "backend-qns7.onrender.com";
// const BACK_URL = "https://backend-qns7.onrender.com";
const BACK_URL = "http://localhost:8080";

function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = localStorage.getItem("role");
  console.log(role);

  const [pics, setPics] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem("token")
    axios
      .get(`${BACK_URL}/admin/in-progress-complaints`,
      {headers: {
        Authorization: `Bearer ${token}`,
      }},)
      .then((response) => {
        console.log(response.data);

        //const ids = response.data.map((org) => org.id);
        //console.log("ids: " + ids);

        // Pokreni zahtjeve za sve ID-eve paralelno
   

        setComplaints(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching activities:", err);
        setError("Error fetching activities.");
        setLoading(false);
      });
  }, []);

 

  if (loading)
    return <p className="p-8 text-gray-500">Učitavam pritužbe...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <section className="p-8">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {complaints.length === 0 ? (
          <h1>Trenutno nema pritužbi.. </h1>
        ) : (
          complaints.map((comp, index) => (
            <Link to={`/admin/complaint/${comp.id}`}>
              <ComplaintCard
               
               title={comp.title}
               date={comp.date}
               firstName={comp.firstName}
               lastName={comp.lastName}
              />
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

export default ComplaintList;
