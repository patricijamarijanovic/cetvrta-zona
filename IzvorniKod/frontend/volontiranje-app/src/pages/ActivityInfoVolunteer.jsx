import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBarLoggedIn from "./assets/navBarVol";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewSection from '../components/ReviewSection';

// const BACK_URL = "backend-qns7.onrender.com";
// const BACK_URL = "https://backend-qns7.onrender.com";
const BACK_URL = "http://localhost:8080";

function ActivityInfoVolunteer() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  console.log(token);
  const [hasApplied, setApplication] = useState(false);
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const [loading1, setLoading1] = useState(false);

  useEffect(() => {
    axios
      .get(`${BACK_URL}/volunteer/activity/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);

        setActivity(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching activities:", err);
        //setError("Error fetching activities.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (activity && activity.projectID) {
      // Uvjet da se activity.projectID učita
      axios
        .get(`${BACK_URL}/home/project-picture/${activity.projectID}`, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          if (res.status === 204) {
            setImage("/images/nekaovog2.jpg"); // Ako nema slike, postavi zadanu
          } else {
            const imageBlob = new Blob([res.data], { type: "image/jpeg" });
            const imageUrl = URL.createObjectURL(imageBlob);
            setImage(imageUrl); // Postavi URL slike
          }
        })
        .catch(() => {
          setImage("/images/nekaovog2.jpg"); // U slučaju greške, postavi zadanu sliku
        });
    }
  }, [activity]);

  if (loading)
    return <p className="p-8 text-gray-500">Učitavam aktivnosti...</p>;

  if (activity.urgent == false) {
    activity.hitno = "NE";
  } else {
    activity.hitno = "DA";
  }

  const handleSubmit = async (e) => {
    if (loading1) return;
    setLoading1(true);
    try {
      await axios.post(
        `${BACK_URL}/volunteer/apply/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //alert("Uspješna prijava projekta!");
      setLoading1(false);
      window.location.reload();
      //navigate("/organization/home");
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("hr-HR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <>
      <div className="bg-slate-600 rounded-b-3xl text-white">
        <NavBarLoggedIn />
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="bg-slate-600 shadow-lg rounded-lg p-6">
          <img
            src={image}
            className="rounded-lg object-cover h-80 w-full mb-4 border border-white"
          />

          <h1 className="text-3xl font-bold text-white mb-4">
            {activity.projectname}
          </h1>
          <p className="text-white text-lg mb-6">{activity.projectdesc}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="font-bold text-white">Organizacija:</p>
              {/* <p className="text-white">{activity.organizationName}</p> */}
              <p
                className="text-white font-bold cursor-pointer hover:text-yellow-400"
                onClick={() =>
                  navigate(`/profile/organization/${activity.organizationID}`)
                }
              >
                {activity.organizationName}
              </p>
            </div>
            <div>
              <p className="font-bold text-white">Email:</p>
              <p className="text-white">{activity.organizationEmail}</p>
            </div>
            <div>
              <p className="font-bold text-white">Početak:</p>
              <p className="text-white">{formatDate(activity.beginningdate)}</p>
            </div>
            <div>
              <p className="font-bold text-white">Kraj:</p>
              <p className="text-white">{formatDate(activity.enddate)}</p>
            </div>
            <div>
              <p className="font-bold text-white">Lokacija:</p>
              <p className="text-white">{activity.projectlocation}</p>
            </div>
            <div>
              <p className="font-bold text-white">Potreban broj volontera:</p>
              <p className="text-white">{activity.maxnumvolunteers}</p>
            </div>
            <div>
              <p className="font-bold text-white">Hitno:</p>
              <p className="text-white">{activity.hitno}</p>
            </div>
            <div>
              <p className="font-bold text-white">Kategorija:</p>
              <p className="text-white">{activity.typeofwork}</p>
            </div>
          </div>

          {activity.status === "CLOSED" ? (
            <p className="text-red-500 font-bold text-center">
              Aktivnost je završila.
            </p>
          ) : activity.hasApplied ? (
            <p className="text-green-500 font-bold text-center">
              Prijava na projekt uspješna! Kada vas organizacija prihvati, bit
              ćete obaviješteni mailom.
            </p>
          ) : activity.numvolunteers >= activity.maxnumvolunteers ? (
            <p className="text-orange-500 font-bold text-center">
              Popunjena su sva mjesta za ovu aktivnost.
            </p>
          ) : (
            <button
              onClick={handleSubmit}
              className="w-full bg-yellow-300 text-black font-bold py-2 px-4 rounded hover:bg-yellow-400"
            >
              Prijavi se!
            </button>
          )}
        </div>

        {activity && (
          <ReviewSection 
            projectId={id}
            userRole="VOLUNTEER"
            hasParticipated={activity.hasParticipated}
            isFinished={activity.status === "CLOSED"}
            isOrganizer={false}
            token={token}
            hasReviewed={activity.hasReviewed}
          />
        )}
      </div>
    </>
  );
}

export default ActivityInfoVolunteer;
