import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "/src/pages/assets/navBar";

function Options() {
  const navigate = useNavigate();

  const handleClick1 = () => navigate("/register/volunteer");
  const handleClick2 = () => navigate("/register/organization");

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Tu je token!!" + token);
    if (token) {
      console.log("idemo");
      // navigate("/not-authorized", { replace: true });

      return;
    }
  }, [navigate]);

  return (
    <>
      <div className="bg-slate-600 rounded-b-3xl text-white">
        <NavBar />
      </div>

      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-yellow-500">Volontiraj</span> i ti s nama
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-800">
              Registiraj se!
            </h2>
            <h2 className="text-xl md:text-2xl text-gray-800">
              Odaberi vrstu korisničkog računa:
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

            <div className="bg-slate-600 shadow-lg hover:shadow-xl transition-shadow p-6 rounded-xl">
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  VOLONTERSKI
                </h1>
              </div>
              <h2 className="text-center text-lg mb-8 text-white">
                Volonteri se prijavljuju na aktivnosti
              </h2>
              <div className="flex justify-center">
                <button
                  onClick={handleClick1}
                  class="bg-yellow-300 text-black text-xl py-2 px-4 rounded-s-3xl rounded-e-3xl hover:bg-yellow-400"
                >
                  ODABERI
                </button>
              </div>
            </div>

            <div className="bg-slate-600 shadow-lg hover:shadow-xl transition-shadow p-6 rounded-xl">
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  ORGANIZACIJSKI
                </h1>
              </div>
              <h2 className="text-center text-lg mb-8 text-white">
                Organizacije objavljuju aktivnosti
              </h2>
              <div className="flex justify-center">
                <button
                  onClick={handleClick2}
                  class="bg-yellow-300 text-black text-xl py-2 px-4 rounded-s-3xl rounded-e-3xl hover:bg-yellow-400"
                >
                  ODABERI
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Options;
