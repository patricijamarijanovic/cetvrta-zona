import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="flex items-center justify-between p-12">
      <a href="/admin/home" className="text-4xl font-bold hover:text-yellow-300">
        VSN<span className="text-yellow-400">!</span>
      </a>

      <nav className="hidden md:flex space-x-4">
       
     
        <button
          onClick={handleLogOut}
          className="bg-yellow-300 text-black py-2 px-4 rounded-s-3xl rounded-e-3xl hover:bg-yellow-400"
        >
          Odjava
        </button>
      </nav>

      <img
        src="/images/menu.png"
        className="md:hidden size-10 cursor-pointer"
        onClick={toggleMenu}
      ></img>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 transform z-50
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"} 
          transition-transform duration-300`}
      >
        <button
          onClick={toggleMenu}
          className="p-2 text-gray-400 hover:text-white focus:outline-none absolute top-4 right-4"
        >
          x
        </button>

        <nav className="mt-16 space-y-4 p-4">
         
          
          <a onClick={handleLogOut} className="block hover:text-yellow-400 cursor-pointer">
            Odjava
          </a>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
