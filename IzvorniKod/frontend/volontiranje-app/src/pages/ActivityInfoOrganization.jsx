import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBarLoggedIn from "./assets/navBarOrg";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from "./assets/card";

// const BACK_URL = "backend-qns7.onrender.com";
// const BACK_URL = "https://backend-qns7.onrender.com";
const BACK_URL = "http://localhost:8080";

function ActivityInfoOrganization() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);

  const token = localStorage.getItem("token");
  const [volunteers, setVolunteers] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [loadingVolunteers, setLoadingVolunteers] = useState(true);

  useEffect(() => {
    axios
      .get(`${BACK_URL}/home/activity/${id}`)
      .then((response) => {
        console.log(response.data);
        setActivity(response.data);
        setLoadingActivity(false);
      })
      .catch((err) => {
        console.error("Error fetching activities:", err);
        //setError("Error fetching activities.");
        setLoadingActivity(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${BACK_URL}/organization/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);

        setVolunteers(response.data);
        setLoadingVolunteers(false);
      })
      .catch((err) => {
        console.error("Error fetching activities:", err);
        //setError("Error fetching activities.");

        setLoadingVolunteers(false);
      });
  }, []);

  if (loadingActivity || loadingVolunteers) {
    return <p className="p-8 text-gray-500">Učitavam podatke...</p>;
  }
  if (!activity) {
    return <p className="p-8 text-gray-500">Nema podataka o aktivnosti.</p>;
  }

  if (activity.urgent == false) {
    activity.hitno = "NE";
  } else {
    activity.hitno = "DA";
  }

  const handleAccept = async (volunteerId) => {
    console.log(volunteerId);
    axios
      .put(
        `${BACK_URL}/organization/applications/${id}/accept/${volunteerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error fetching activities:", err);
        //setError("Error fetching activities.");
      });
  };

  const handleReject = async (volunteerId) => {
    axios
      .put(
        `${BACK_URL}/organization/applications/${id}/reject/${volunteerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error fetching activities:", err);
        //setError("Error fetching activities.");
      });
  };

  return (
    <>
      <div className="bg-slate-600 rounded-b-3xl text-white">
        <NavBarLoggedIn />
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="bg-slate-600 shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-white mb-4">
            {activity.projectname}
          </h1>
          <p className="text-white text-lg mb-6">{activity.projectdesc}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="font-bold text-white">Organizacija:</p>
              <p className="text-white">{activity.organizationName}</p>
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

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Prijavljeni volonteri
            </h2>
            {volunteers.length === 0 ? (
              <p className="text-gray-300 text-lg">
                Nažalost trenutačno nema prijavljenih volontera.
              </p>
            ) : (
              <div className="space-y-4">
                {volunteers.map((volunteer, index) => (
                  <div
                    key={index}
                    className="bg-slate-500 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-white font-bold">
                        {volunteer.firstName} {volunteer.lastName}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      {volunteer.status === "ACCEPTED" ? (
                        <p className="text-green-400 font-bold">Prihvaćen</p>
                      ) : volunteer.status === "REJECTED" ? (
                        <p className="text-red-400 font-bold">Odbijen</p>
                      ) : (
                        <>
                          <button
                            onClick={() => handleAccept(volunteer.volunteerId)}
                            className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                          >
                            Prihvati
                          </button>
                          <button
                            onClick={() => handleReject(volunteer.volunteerId)}
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                          >
                            Odbij
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ActivityInfoOrganization;
