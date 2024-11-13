import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../pages/assets/navBar";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setError] = useState({});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const Validation = (values) => {
    let errors = {};

    if (!values.username) {
      errors.username = "Potrebno je unijeti korisničko ime.";
    }

    if (!values.password) {
      errors.password = "Potrebno je unijeti lozinku.";
    }

    return errors;
  };
  // useEffect(() => {
  //     const token = localStorage.getItem('token');
  //     console.log('Tu je token!!' + token)
  //     if (token) {
  //       console.log("idemo")
  //       navigate('/not-authorized', { replace: true });

  //       return;
  //     }

  //   }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = Validation({ username, password });
    setError(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const token = await axios.post("http://localhost:8080/authenticate", {
          username: username,
          password: password,
        });
        //console.log("Odgovor sa servera:", response.data);
        //const token = response.data.token;

        if (token) {
          console.log("Token:", JSON.stringify(token.data.jwt)); // Ispiši token u konzolu

          //alert("Token: " +  JSON.stringif(decoded.role)); // Prikaži token u alertu
          // Spremi token u localStorage ako trebaš
          localStorage.setItem("token", token.data.jwt);
          localStorage.setItem("role", token.data.role);

          if (token.data.role == "ROLE_VOLUNTEER") {
            navigate("/volunteer/home");
          } else if (token.data.role == "ROLE_ORGANIZATION") {
            navigate("/organization/home");
          }
        } else {
          alert("Nema tokena u odgovoru.");
        }
      } catch (err) {
        // alert(err);
        setError((prevErrors) => ({
          ...prevErrors,
          pogreska: "Pogrešno korisničko ime ili lozinka.",
        }));
      }
    }
  };

  useEffect(() => {
    // Provjeri URL parametre
    console.log(" u use effectu sam!");
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    const roleFromUrl = urlParams.get("role");

    // Ako postoji token i role u URL-u, postavi ih u state i localStorage
    if (tokenFromUrl && roleFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      localStorage.setItem("role", roleFromUrl);

      console.log("imam token!", localStorage.getItem("token"));
      console.log("imam role!", localStorage.getItem("role"));

      // Preusmjeri korisnika na odgovarajuću početnu stranicu
      if (roleFromUrl === "ROLE_VOLUNTEER") {
        console.log("navigiram dalje na volonterski");
        navigate("/volunteer/home");
      } else if (roleFromUrl === "ROLE_ORGANIZATION") {
        console.log("navigiram dalje na organizacijski");
        navigate("/organization/home");
      }
    } else {
      console.log("idkk");
    }
  }, [navigate]);

  const googleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <>
      <div className="bg-slate-600 rounded-b-3xl text-white">
        <NavBar />
      </div>

      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-yellow-500">PRIJAVA</h1>
          </div>

          <div className="bg-slate-600 shadow-lg p-6 rounded-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="text-white font-semibold">
                  Korisničko ime
                </label>
                <input
                  id="username"
                  name="username"
                  type="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-white font-semibold">
                  Lozinka
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 ${
                      errors.password
                        ? "border-red-500 pr-10"
                        : "pr-10 border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 size-10"
                  >
                    {showPassword ? (
                      <img src="/images/notVisible.png" alt="Hide Password" />
                    ) : (
                      <img src="/images/visible.png" alt="Show Password" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="text-right">
                <a href="#" className="text-red-400 hover:text-red-500 text-sm">
                  Zaboravili ste lozinku?
                </a>
              </div>

              {errors.general && (
                <p className="text-sm text-red-500 text-center">
                  {errors.general}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-yellow-300 text-black hover:bg-yellow-400 text-lg py-2 rounded-lg"
              >
                PRIJAVI SE
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500 rounded-sm">
                    ili
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-lg py-2 rounded-lg shadow-sm flex items-center justify-center"
                onClick={googleLogin}
              >
                <img
                  src="/images/google-g.png"
                  alt="Google logo"
                  className="mr-2 h-4 w-4"
                />
                Nastavite sa svojim Google računom
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
