import { useEffect, useState } from "react";
import NavBarLoggedIn from "./assets/navBarOrg";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// const BACK_URL = "backend-qns7.onrender.com";
// const BACK_URL = "https://backend-qns7.onrender.com";
const BACK_URL = "http://localhost:8080";

function ActivityInfoOrganization() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activity, setActivity] = useState(null);

  const token = localStorage.getItem("token");
  const [volunteers, setVolunteers] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [loadingVolunteers, setLoadingVolunteers] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    projectname: "",
    projectdesc: "",
    typeofwork: "",
    beginningdate: "",
    enddate: "",
    projectlocation: "",
    numregisteredvolunteers: "",
    maxnumvolunteers: "",
    status: "",
    projectID: id,
    urgent: "",
    organizationName: "",
    organizationID: "",
    organizationEmail: "",
  });
  const [emergency, setEmergency] = useState(false);
  const [emergencyDropdownOpen, setEmergencyDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const [originalData, setOriginalData] = useState(null);
  const [savedProfilePicture, setSavedProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const [image, setImage] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  function handleImage(e) {
    setImage(e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfilePicture(imageURL);
    }
  }

  useEffect(() => {
    axios
      .get(`${BACK_URL}/home/activity/${id}`)
      .then((response) => {
        console.log(response.data);
        if (response.data.typeofwork === "OKOLIS") {
          response.data.typeofwork = "OKOLIŠ";
        }
        if (response.data.typeofwork === "ZIVOTINJE") {
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
            setProfilePicture("/images/nekaovog2.jpg"); // Ako nema slike, postavi zadanu
          } else {
            const imageBlob = new Blob([res.data], { type: "image/jpeg" });
            const imageUrl = URL.createObjectURL(imageBlob);
            setProfilePicture(imageUrl); // Postavi URL slike
          }
        })
        .catch(() => {
          setProfilePicture("/images/nekaovog2.jpg"); // U slučaju greške, postavi zadanu sliku
        });
    }
  }, [activity]);

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
    if(loading) return;
    setLoading(true);
    console.log(volunteerId);
    const token = localStorage.getItem("token");

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
        setLoading(false);
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error fetching activities:", err);
        //setError("Error fetching activities.");
      });
  };

  const handleReject = async (volunteerId) => {
    if(loading) return;
    setLoading(true);
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
        setLoading(false);
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error fetching activities:", err);
        //setError("Error fetching activities.");
      });
  };

  const handleEdit = () => {
    setOriginalData(editData);
    setEditMode(true);
    setSavedProfilePicture(profilePicture);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    const formData = new FormData();
    formData.append("image", image);

    axios
      .post(
        `${BACK_URL}/organization/edit-project-picture/${activity.projectID}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .catch((err) => console.error("Error uploading picture: ", err));

    e.preventDefault(); // Prevent page reload on form submit
    console.log("bok" + id);
    if (editData.typeofwork === "OKOLIŠ") {
      editData.typeofwork = "OKOLIS";
    }
    if (editData.typeofwork === "ŽIVOTINJE") {
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
          enddate: editData.enddate,
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
    if (originalData) {
      setEditData(originalData);
    }
    setEditMode(false);
    setProfilePicture(savedProfilePicture);
  };

  const toggleEmergencyDropdown = () => {
    setEmergencyDropdownOpen(!emergencyDropdownOpen);
    setCategoryDropdownOpen(false);
  };

  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
    setEmergencyDropdownOpen(false);
  };

  const handleCategoryChange = (category) => {
    setEditData({
      ...editData,
      typeofwork: category,
    });

    setCategoryDropdownOpen(false);
  };

  const handleEmergencyChange = (value) => {
    setEditData({
      ...editData,
      urgent: value,
    });

    setEmergencyDropdownOpen(false);
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
        <div className="flex flex-col items-center mb-6"></div>

        <div className="bg-slate-600 shadow-lg rounded-lg p-6">
          {!editMode ? (
            <>
              <div className="rounded-lg object-cover h-80 w-full mb-4">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="rounded-lg object-cover h-80 w-full mb-4 border border-white"
                  />
                ) : (
                  <span className="text-gray-500">Nema slike</span>
                )}
              </div>
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
                  <p className="font-bold text-white">
                    Potreban broj volontera:
                  </p>
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
                <div className="mt-6">
                  <button
                    onClick={handleEdit}
                    className="bg-yellow-400 px-6 py-3 text-lg rounded hover:bg-yellow-500"
                  >
                    Uredi podatke
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-lg object-cover h-80 w-full mb-4">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="rounded-lg object-cover h-80 w-full mb-1 border border-white"
                  />
                ) : (
                  <span className="text-gray-500">Nema slike</span>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <input
                    type="file"
                    name="file"
                    onChange={handleImage}
                    style={{ display: "none" }}
                    id="fileInput"
                  />

                  <button
                    className="bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("fileInput").click();
                    }}
                  >
                    Promijeni sliku
                  </button>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="projectName"
                    className="text-white font-semibold"
                  >
                    Ime projekta
                  </label>
                  <input
                    id="projectName"
                    name="projectname"
                    type="text"
                    value={editData.projectname}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 border-gray-300"
                    placeholder="Ime projekta"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="text-white font-semibold"
                  >
                    Opis projekta
                  </label>
                  <textarea
                    id="description"
                    name="projectdesc"
                    value={editData.projectdesc}
                    onChange={handleChange}
                    rows="3"
                    className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 border-gray-300"
                    placeholder="Opis projekta"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="beginDate"
                      className="text-white font-semibold"
                    >
                      Datum početka projekta
                    </label>
                    <input
                      id="beginDate"
                      name="beginningdate"
                      type="date"
                      value={editData.beginningdate}
                      onChange={handleChange}
                      className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="endDate"
                      className="text-white font-semibold"
                    >
                      Datum završetka projekta
                    </label>
                    <input
                      id="endDate"
                      name="enddate"
                      type="date"
                      value={editData.enddate}
                      onChange={handleChange}
                      className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="location"
                      className="text-white font-semibold"
                    >
                      Lokacija
                    </label>
                    <input
                      id="location"
                      name="projectlocation"
                      type="text"
                      value={editData.projectlocation}
                      onChange={handleChange}
                      className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 border-gray-300"
                      placeholder="Lokacija"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="maxVolunteers"
                      className="text-white font-semibold"
                    >
                      Broj potrebnih volontera
                    </label>
                    <input
                      id="maxVolunteers"
                      name="maxnumvolunteers"
                      type="number"
                      value={editData.maxnumvolunteers}
                      onChange={handleChange}
                      min="1"
                      className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-white font-semibold">Hitno</label>
                    <div className="relative" onClick={toggleEmergencyDropdown}>
                      <div className="border rounded-lg p-3 cursor-pointer bg-white text-gray-700 flex justify-between items-center">
                        <span>{editData.urgent ? "Da" : "Ne"}</span>
                        <img
                          src="/images/one-down-arrow.png"
                          alt="Arrow"
                          className="w-4 h-4"
                        />
                      </div>
                      {emergencyDropdownOpen && (
                        <div className="absolute z-10 bg-white shadow-lg rounded-lg mt-2 w-full border">
                          <div
                            className="p-3 cursor-pointer hover:bg-gray-200 hover:rounded-t-lg"
                            onClick={() => handleEmergencyChange(true)}
                          >
                            Da
                          </div>
                          <div
                            className="p-3 cursor-pointer hover:bg-gray-200 hover:rounded-b-lg"
                            onClick={() => handleEmergencyChange(false)}
                          >
                            Ne
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white font-semibold">
                      Kategorija projekta
                    </label>
                    <div className="relative" onClick={toggleCategoryDropdown}>
                      <div className="border rounded-lg p-3 cursor-pointer bg-white text-gray-700 flex justify-between items-center">
                        <span>{editData.typeofwork}</span>
                        <img
                          src="/images/one-down-arrow.png"
                          alt="Arrow"
                          className="w-4 h-4"
                        />
                      </div>
                      {categoryDropdownOpen && (
                        <div className="absolute z-10 bg-white shadow-lg rounded-lg mt-2 w-full border max-h-60 overflow-y-auto">
                          {categories.map((category) => (
                            <div
                              key={category}
                              className="p-3 cursor-pointer hover:bg-gray-200"
                              onClick={() => handleCategoryChange(category)}
                            >
                              {category}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-4 pt-6">
                  <button
                    type="submit"
                    className="bg-yellow-300 text-black text-2xl py-2 px-4 rounded-s-3xl rounded-e-3xl hover:bg-yellow-400"
                  >
                    Spremi promjene
                  </button>
                  <button
                    type="button"
                    onClick={handleDontSave}
                    className="bg-red-500 text-white text-2xl py-2 px-4 rounded-s-3xl rounded-e-3xl hover:bg-red-600"
                  >
                    Odbaci
                  </button>
                </div>
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
                      <p
                        className="text-white font-bold cursor-pointer hover:text-yellow-400"
                        onClick={() =>
                          navigate(
                            `/profile/volunteer/${volunteer.volunteerId}`
                          )
                        }
                      >
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
