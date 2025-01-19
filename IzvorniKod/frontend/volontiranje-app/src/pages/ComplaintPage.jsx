import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "./assets/NavBarAdmin";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

// const BACK_URL = "backend-qns7.onrender.com";
// const BACK_URL = "https://backend-qns7.onrender.com";
const BACK_URL = "http://localhost:8080";

function ComplaintPage() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [errors, setErrors] = useState([]);

  const [responseText, setResponseText] = useState(""); // Za unos adminovog odgovora
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(loading);
    axios
      .get(`${BACK_URL}/admin/complaint/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);

        setComplaint(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching activities:", err);
        //setError("Error fetching activities.");
        setLoading(false);
      });
  }, []);

  const Validation = (values) => {
    let errors = {};

    if (!values.responseText) {
      errors.response = "Potrebno je unijeti odgovor.";
    }

    return errors;
  };

  const handleResponseSubmit = (e) => {
    e.preventDefault();
    if (loadingResponse) return;
    setLoadingResponse(true);

    const token = localStorage.getItem("token");
    const validationErrors = Validation({
      responseText,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      axios
        .post(
          `${BACK_URL}/admin/respond/${id}`,
          { response: responseText },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          alert("Odgovor uspješno poslan!");
          setResponseText("");
          setLoadingResponse(false);
        })
        .catch((err) => {
          console.error("Error sending response:", err);
          alert("Greška pri slanju odgovora.");
        });
    }
  };

  const handleResolved = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    axios
      .post(
        `${BACK_URL}/admin/resolved/${id}`,
        { response: responseText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        console.log("Riješeno!!");
        navigate("/admin/home");
      })
      .catch((err) => {
        console.error("Error sending response:", err);
        alert("Greška pri slanju odgovora.");
      });
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("hr-HR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (loading) return <p className="p-8 text-gray-500">Učitavanje...</p>;

  return (
    <>
      <div className="bg-slate-600 rounded-b-3xl text-white">
        <NavBar />
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="bg-slate-600 shadow-lg rounded-lg px-6 pt-6 pb-1">
          <h1 className="text-3xl font-bold text-white mb-4">
            {complaint.title}
          </h1>
          <p className="text-white text-lg mb-6">{complaint.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="font-bold text-white">Datum:</p>
              <p className="text-white">{formatDate(complaint.date)}</p>
            </div>

            <div>
              <p className="font-bold text-white">Email:</p>
              <p className="text-white">{complaint.email}</p>
            </div>

            <div>
              {complaint.lastName ? (
                <p className="font-bold text-white">Ime:</p>
              ) : (
                <p className="font-bold text-white">Ime organizacije:</p>
              )}
              <p className="text-white">{complaint.firstName}</p>
            </div>
            {complaint.lastName ? (
              <div>
                <p className="font-bold text-white">Prezime:</p>
                <p className="text-white">{complaint.lastName}</p>
              </div>
            ) : (
              <div></div>
            )}

            <button
              type="submit"
              onClick={handleResolved}
              className="bg-yellow-400 text-black text-xl font-semibold py-3 px-6 mt-4 rounded-xl shadow-md hover:bg-yellow-500"
            >
              Riješi pritužbu
            </button>
          </div>
        </div>

        <div className="bg-slate-600 shadow-lg rounded-lg p-6 mt-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Odgovor korisniku
          </h2>
          <form onSubmit={handleResponseSubmit}>
            <textarea
              className="w-full h-32 p-4 rounded-lg bg-gray-200 text-gray-800"
              placeholder="tekst..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
            ></textarea>
            {errors.response && (
              <p className="text-sm text-red-500">{errors.response}</p>
            )}
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
            >
              Pošalji odgovor
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ComplaintPage;
