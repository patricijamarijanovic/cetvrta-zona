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
  const [image, setImage] = useState("");
  const token = localStorage.getItem("token");
  const [volunteers, setVolunteers] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [loadingVolunteers, setLoadingVolunteers] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    projectname: '',
    projectdesc: '',
    typeofwork: '',
    beginningdate: '',
    enddate: '',
    projectlocation: '',
    numregisteredvolunteers: '',
    maxnumvolunteers: '',
    status:'',
    projectID: id,
    urgent: '',
    organizationName: '',
    organizationID: '',
    organizationEmail: '',
  });

  const categories = [
    "DJECA",
    "INVALIDI",
    "STARIJI",
    "SPORT",
    "ŽIVOTINJE",
    "EDUKACIJA",
    "ZDRAVLJE",
    "OKOLIŠ",
    "OSTALO",
  ];

  useEffect(() => {
    axios
      .get(`${BACK_URL}/home/activity/${id}`)
      .then((response) => {
        console.log(response.data);
        if(response.data.typeofwork === "OKOLIS") {
          response.data.typeofwork = "OKOLIŠ";
        }
        if(response.data.typeofwork === "ZIVOTINJE") {
          response.data.typeofwork = "ŽIVOTINJE";
        }
        setActivity(response.data);
        setEditData({
          projectname: response.data.projectname,
          projectdesc: response.data.projectdesc,
          typeofwork: response.data.typeofwork,
          beginningdate: response.data.beginningdate,
          enddate: response.data.enddate,
          projectlocation: response.data.projectlocation,
          numregisteredvolunteers: response.data.numregisteredvolunteers,
          maxnumvolunteers: response.data.maxnumvolunteers,
          status: response.data.status,
          projectID: response.data.projectID,
          urgent: response.data.urgent,
          organizationName: response.data.organizationName,
          organizationID: response.data.organizationID,
          organizationEmail: response.data.organizationEmail,
        });
        setLoadingActivity(false);
      })
      .catch((err) => {
        console.error("Error fetching activities:", err);
        //setError("Error fetching activities.");
        setLoadingActivity(false);
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
            setImage("/images/nekaovog.jpg"); // Ako nema slike, postavi zadanu
          } else {
            const imageBlob = new Blob([res.data], { type: "image/jpeg" });
            const imageUrl = URL.createObjectURL(imageBlob);
            setImage(imageUrl); // Postavi URL slike
          }
        })
        .catch(() => {
          setImage("/images/nekaovog.jpg"); // U slučaju greške, postavi zadanu sliku
        });
    }
  }, [activity])

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

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    console.log(editData.projectID)
    if(editData.typeofwork === "OKOLIŠ") {
      editData.typeofwork = "OKOLIS";
    }
    if(editData.typeofwork === "ŽIVOTINJE") {
      editData.typeofwork = "ZIVOTINJE";
    }

    
    try {
      const response = await axios.post(
        `${BACK_URL}/organization/edit-project`,
        {
          projectname: editData.projectname,
          projectdesc: editData.projectdesc,
          typeofwork: editData.typeofwork,
          beginningdate: editData.beginningdate,
          enddate:editData.enddate,
          projectlocation: editData.projectlocation,
          numregisteredvolunteers: editData.numregisteredvolunteers,
          maxnumvolunteers: editData.maxnumvolunteers,
          status: editData.status,
          projectID: editData.projectID,
          urgent: editData.urgent,
          organizationName: editData.organizationName,
          organizationID: editData.organizationID,
          organizationEmail: editData.organizationEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Activity updated:", response.data);
      setEditMode(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  const handleDontSave = () => {
    setEditMode(false);
  };

  return (
    <>
      <div className="bg-slate-600 rounded-b-3xl text-white">
        <NavBarLoggedIn />
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="bg-slate-600 shadow-lg rounded-lg p-6">
        {!editMode ? (
            <>
              <h1 className="text-3xl font-bold text-white mb-4">
                {activity.projectname}
              </h1>
              <img
                src={image}
                className="rounded-lg object-cover h-40 w-full mb-4"
              />
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
                <button onClick={handleEdit}>Uredi</button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="projectname"
                  value={editData.projectname}
                  onChange={handleChange}
                  className="text-3xl font-bold text-white mb-4 bg-transparent border-b border-white focus:outline-none"
                />

                <img
                  src={image}
                  className="rounded-lg object-cover h-40 w-full mb-4"
                />
                <textarea
                  name="projectdesc"
                  value={editData.projectdesc}
                  onChange={handleChange}
                  className="text-white text-lg mb-6 w-full bg-transparent border border-white rounded p-2 focus:outline-none"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="font-bold text-white">Početak:</label>
                    <input
                      type="date"
                      name="beginningdate"
                      value={editData.beginningdate}
                      onChange={handleChange}
                      className="text-white bg-transparent border-b border-white w-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-white">Kraj:</label>
                    <input
                      type="date"
                      name="enddate"
                      value={editData.enddate}
                      onChange={handleChange}
                      className="text-white bg-transparent border-b border-white w-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-white">Lokacija:</label>
                    <input
                      type="text"
                      name="projectlocation"
                      value={editData.projectlocation}
                      onChange={handleChange}
                      className="text-white bg-transparent border-b border-white w-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-white">Potreban broj volontera:</label>
                    <input
                      type="number"
                      name="maxnumvolunteers"
                      value={editData.maxnumvolunteers}
                      onChange={handleChange}
                      className="text-white bg-transparent border-b border-white w-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-white">Hitno:</label>
                    <select
                      name="urgent"
                      value={editData.urgent}
                      onChange={handleChange}
                      className="text-white bg-transparent border-b border-white w-full focus:outline-none"
                    >
                      <option value="true">DA</option>
                      <option value="false">NE</option>
                    </select>
                  </div>
                  <div>
                  <label className="font-bold text-white">Kategorija:</label>
                  <select
                    name="typeofwork"
                    value={editData.typeofwork}
                    onChange={handleChange}
                    className="text-white bg-transparent border-b border-white w-full focus:outline-none"
                  >
                    
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                  Spremi promjene
                </button>
                <button
                  type="button"
                  onClick={handleDontSave}
                  className="bg-red-500 text-white p-2 rounded ml-2"
                >
                  Odbaci
                </button>
              </form>
            </>
          )}

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
