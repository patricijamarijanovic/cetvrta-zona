import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBarLoggedIn from "./assets/navBarOrg";
import axios from "axios";

const BACK_URL = "http://localhost:8080";

function AboutPageOrg() {
    const [message, setMessage] = useState("");
  const navigate = useNavigate();

 useEffect(() => {
    console.log("u organizacijskom sam home pageu");
    const token = localStorage.getItem("token");
    console.log("Tu je token!" + token);
    if (!token) {
      console.log("nema tokena!");
      navigate("/not-authorized", { replace: true });

      return;
    }

    console.log("saljem token na backend");
    axios
      .get(`${BACK_URL}/organization/home`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMessage(response.data);
        console.log("Tu sam!");
      })
      .catch((error) => {
        console.log("error: ", error);
        console.error("Greška prilikom provjere tokena:", error.message); // Dodano ispisivanje glavne poruke
        if (error.response) {
          console.error("Odgovor poslužitelja:", error.response.data); // Dodano ispisivanje server response data
        }
        navigate("/not-authorized", { replace: true });
      });
  }, [navigate]);


  return (
    <div className="relative min-h-screen">
      <div className="bg-slate-600 rounded-b-3xl text-white">
        <NavBarLoggedIn />
      </div>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-700 mb-4">VOLONTIRAJ S NAMA</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-6">Platforma za volontiranje</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          <strong>Volontiraj s nama</strong> platforma je osmišljena kako bi povezala volontere s lokalnim 
          projektima i organizacijama kojima je potrebna pomoć. Naš cilj je olakšati volonterima 
          pronalazak prilika u njihovoj zajednici, dok organizacijama pružamo alat za jednostavno 
          objavljivanje projekata i traženje podrške.
        </p>
        <p className="text-lg text-gray-600 leading-relaxed mt-4">
          Kao posrednik između onih koji žele pridonijeti društvu i onih kojima je pomoć potrebna, 
          pojednostavljujemo proces angažiranja volontera i praćenja njihovog doprinosa. Na taj način, 
          svi zajedno gradimo snažniju i povezaniju zajednicu.
        </p>
        <p className="text-lg font-semibold text-gray-600 mt-6">
          Pridruži nam se i ti – napravi razliku u svojoj zajednici!
        </p>
        </div>

          <div className="flex justify-center md:justify-end -mt-[30px]">
            <img
              src="/images/sticker1.png"
              alt="Volunteer helping the old lady"
              width={400}
              height={400}
              className="max-w-[80%]"
            />
      </div>
    </div>
  );
}

export default AboutPageOrg;
