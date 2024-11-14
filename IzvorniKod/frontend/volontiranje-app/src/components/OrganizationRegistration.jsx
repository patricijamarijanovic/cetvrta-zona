import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../pages/assets/navBar";
import axios from "axios";

function OrganizationLogin() {
  const [username, setUsername] = useState("");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const navigate = useNavigate();

  const [errors, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const Validation = (values) => {
    let errors = {};

    if (!values.username) {
      errors.username = "Potrebno je unijeti korisničko ime.";
    }

    if (!values.password) {
      errors.password = "Potrebno je unijeti lozinku.";
    } else if (values.password.length < 8) {
      errors.password = "Lozinka mora sadržavati minimalno 8 znakova.";
    }

    if (!values.password2) {
      errors.password2 = "Potrebno je ponoviti lozinku.";
    } else if (values.password !== values.password2) {
      errors.password2 = "Lozinke se ne podudaraju.";
    }

    if (!values.orgName) {
      errors.orgName = "Potrebno je unijeti ime organizacije.";
    }

    if (!values.email) {
      errors.email = "Potrebno je unijeti email.";
    } else if (!values.email.includes("@")) {
      errors.email = "Pogrešan format maila.";
    }

    return errors;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Tu je token!!" + token);
    if (token) {
      console.log("idemo");
      //   navigate('/not-authorized', { replace: true });

      return;
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Pokrećemo validaciju i pohranjujemo greške u varijablu
    const validationErrors = Validation({
      username,
      email,
      password,
      password2,
      orgName,
    });
    setError(validationErrors);

    // Provjeravamo postoji li greška prije slanja
    if (Object.keys(validationErrors).length === 0) {
      try {
        await axios.post("http://localhost:8080/register/organization", {
          username: username,
          password: password,
          email: email,
          organizationName: orgName,
        });
        alert("Registracija uspješna!");
        navigate('/');
      } catch (err) {
        //alert(err);
        // alert(err);jel
        console.log(err.response);
        if (
          err.response &&
          err.response.data ===
            "Username already taken. Please choose another one."
        ) {
          setError((prevErrors) => ({
            ...prevErrors,
            username: "Korisničko ime već postoji.",
          }));
        } else if (
          err.response &&
          err.response.data ===
            "Email already registered. Please choose another one."
        ) {
          setError((prevErrors) => ({
            ...prevErrors,
            email: "Email adresa već postoji.",
          }));
        } else if (err.response && err.response.data === "") {
          setError((prevErrors) => ({
            ...prevErrors,
            orgName: "Ime organizacije već postoji.",
          }));
        } else {
          setError((prevErrors) => ({
            ...prevErrors,
            pogreska: "Došlo je do greške.",
          }));
        }
      }
    }
  };

  return (
    <>
      <div className="bg-slate-600 rounded-b-3xl text-white">
        <NavBar />
      </div>

      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">
              REGISTRACIJA ORGANIZACIJE
            </h1>
            <h2 className="text-xl text-gray-700">IZRADA KORISNIČKOG RAČUNA</h2>
          </div>

          <div className="bg-slate-600 shadow-lg p-6 rounded-xl">
            <div>
              <h1 className="text-2xl font-semibold text-white pb-6">
                Podatci o organizaciji
              </h1>
            </div>
            <div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="username"
                      className="text-white font-semibold"
                    >
                      Korisničko ime
                    </label>
                    <input
                      id="username"
                      name="username"
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
                    <label htmlFor="email" className="text-white font-semibold">
                      Email adresa
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 ${
                        errors.username ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="orgName"
                      className="text-white font-semibold"
                    >
                      Ime organizacije
                    </label>
                    <input
                      id="orgName"
                      name="orgName"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 ${
                        errors.username ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.orgName && (
                      <p className="text-sm text-red-500">{errors.orgName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-white font-semibold"
                    >
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
                          errors.username ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 size-10"
                      >
                        {showPassword ? (
                          <img src="/images/notVisible.png" />
                        ) : (
                          <img src="/images/visible.png" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password2"
                      className="text-white font-semibold"
                    >
                      Ponovite lozinku
                    </label>
                    <div className="relative">
                      <input
                        id="password2"
                        name="password2"
                        type={showPassword2 ? "text" : "password"}
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 ${
                          errors.username ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword2(!showPassword2)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 size-10"
                      >
                        {showPassword2 ? (
                          <img src="/images/notVisible.png" />
                        ) : (
                          <img src="/images/visible.png" />
                        )}
                      </button>
                    </div>
                    {errors.password2 && (
                      <p className="text-sm text-red-500">{errors.password2}</p>
                    )}
                  </div>
                </div>

                {errors.general && (
                  <p className="text-sm text-red-500 text-center">
                    {errors.general}
                  </p>
                )}

                <div className="flex justify-center gap-4 pt-6">
                  <button
                    type="submit"
                    class="bg-yellow-300 text-black text-2xl py-2 px-4 rounded-s-3xl rounded-e-3xl hover:bg-yellow-400"
                  >
                    Registriraj se
                  </button>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setUsername("");
                      setEmail("");
                      setOrgName("");
                      setPassword("");
                      setPassword2("");
                      setError({});
                    }}
                    className="bg-red-500 text-white py-2 px-4 rounded-s-3xl rounded-e-3xl hover:bg-red-400"
                  >
                    Izbriši podatke
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrganizationLogin;