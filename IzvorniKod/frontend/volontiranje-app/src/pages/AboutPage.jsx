import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "./assets/navBar";

function AboutPage() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  console.log(role)

  return (
    <div className="relative min-h-screen">
      <div className="bg-slate-600 rounded-b-3xl text-white">
        <NavBar />
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

export default AboutPage;
