import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NavBarLoggedIn() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Tu treba stavit da ide na uredivanje vlastitog profila
  const handleNavigateToHome = () => {
    navigate("#");
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
      <a href="/organization/home" className="text-4xl font-bold hover:text-yellow-300">
        VSN<span className="text-yellow-400">!</span>
      </a>

      <nav className="hidden md:flex space-x-4">
        <a href="#" className="hover:text-white/80 py-2">
          aktivnosti
        </a>
        <a href="#" className="hover:text-white/80 py-2">
          organizacije
        </a>
        <a href="#" className="hover:text-white/80 py-2">
          o platformi
        </a>

        {/* User Profile Icon Button */}
        <button
          onClick={() => navigate('#')}
          className="bg-yellow-400 w-10 h-10 flex items-center justify-center rounded-full hover:bg-yellow-500"
          aria-label="User Profile"
        >
          <img
            src="/images/user.png" 
            alt="User Profile"
            className="w-6 h-6"
          />
        </button>
      </nav>

      <img
        src="/images/menu.png"
        className="md:hidden size-10 cursor-pointer"
        onClick={toggleMenu}
      />

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 transform 
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
          <a href="#" className="block hover:text-white/80">
            aktivnosti
          </a>
          <a href="#" className="block hover:text-white/80">
            organizacije
          </a>
          <a href="#" className="block hover:text-white/80">
            o platformi
          </a>
          <a href="/profile" className="block hover:text-yellow-400">
            Profil
          </a>
        </nav>
      </div>
    </header>
  );
}

export default NavBarLoggedIn;
