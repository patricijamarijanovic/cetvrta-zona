import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "./assets/navBar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import ReviewSection from '../components/ReviewSection';

const BACK_URL = "http://localhost:8080";

function ActivityInfo() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const [participationStatus, setParticipationStatus] = useState({
    hasParticipated: false,
    hasApplied: false
  });

  useEffect(() => {
    axios
      .get(`${BACK_URL}/home/activity/${id}`)
      .then((response) => {
        console.log(response.data);
        setActivity(response.data);
        setLoading(false);

        // Fetch participation status
        axios.get(`${BACK_URL}/volunteer/activity/${id}`)
          .then((participationResponse) => {
            setParticipationStatus({
              hasParticipated: participationResponse.data.hasParticipated,
              hasApplied: participationResponse.data.hasApplied
            });
          })
          .catch((err) => {
            console.error("Error fetching participation status:", err);
          });
      })
      .catch((err) => {
        console.error("Error fetching activities:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (activity && activity.projectID) {
      axios
        .get(`${BACK_URL}/home/project-picture/${activity.projectID}`, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          if (res.status === 204) {
            setImage("/images/nekaovog2.jpg");
          } else {
            const imageBlob = new Blob([res.data], { type: "image/jpeg" });
            const imageUrl = URL.createObjectURL(imageBlob);
            setImage(imageUrl);
          }
        })
        .catch(() => {
          setImage("/images/nekaovog2.jpg");
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

  const isActivityFinished = activity.status === "CLOSED";

  return (
    <>
      <div className="bg-slate-600 rounded-b-3xl text-white">
        <NavBar />
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="bg-slate-600 shadow-lg rounded-lg p-6">
          <img
            src={image}
            className="rounded-lg object-cover h-80 w-full mb-4 border border-black"
          />

          <h1 className="text-3xl font-bold text-white mb-4">
            {activity.projectname}
          </h1>
          <p className="text-white text-lg mb-6">{activity.projectdesc}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="font-bold text-white">Organizacija:</p>
              <p 
                className="text-white font-bold cursor-pointer hover:text-yellow-400"
                onClick={() => navigate(`/profile/organization/${activity.organizationID}`)}
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
              <p className="text-white">{activity.beginningdate}</p>
            </div>
            <div>
              <p className="font-bold text-white">Kraj:</p>
              <p className="text-white">{activity.enddate}</p>
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
        </div>
        <h1 className="text-4xl md:text-3xl font-bold text-yellow-500 mt-2">
          <Link to="/login" className="hover:text-yellow-300 no-underline">
            PRIJAVI SE KAKO BI SUDJELOVAO
          </Link>
        </h1>

        {activity && (
          <ReviewSection 
            projectId={id}
            isFinished={activity.status === "CLOSED"}
            isOrganizer={false}
            token={null}
            hasParticipated={false}
            hasReviewed={false}
          />
        )}
      </div>
    </>
  );
}

export default ActivityInfo;
