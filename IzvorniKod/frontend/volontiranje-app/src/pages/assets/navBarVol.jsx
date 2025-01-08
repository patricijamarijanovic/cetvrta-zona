import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NavBarLoggedIn() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Tu treba stavit da ide na uredivanje vlastitog profila
  const handleNavigateToProfile = () => navigate("/profile");
  const handleNavigateToSaved = () => navigate("/saved");
  const handleNavigateToActivities = () => navigate("/activities");
  const handleLogout = () => {
    // Jos treba dodati logiku za odjavu
    navigate("/");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

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
      <a href="/volunteer/home" className="text-4xl font-bold hover:text-yellow-300">
        VSN<span className="text-yellow-400">!</span>
      </a>

      <nav className="hidden md:flex space-x-4">
        <a href="/volunteer/ActivitiesPage" className="hover:text-white/80 py-2">
          aktivnosti
        </a>
        <a href="#" className="hover:text-white/80 py-2">
          organizacije
        </a>
        <a href="#" className="hover:text-white/80 py-2">
          o platformi
        </a>

        <div className="relative">
          <button
            onClick={toggleProfileMenu}
            className="bg-yellow-400 w-10 h-10 flex items-center justify-center rounded-full hover:bg-yellow-500 focus:outline-none"
            aria-label="User Profile"
          >
            <img
              src="/images/user.png"
              alt="User Profile"
              className="w-6 h-6"
            />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
              <a
                onClick={handleNavigateToProfile}
                className="block px-4 py-2 hover:bg-gray-100 hover:rounded-t-lg cursor-pointer"
              >
                profil
              </a>
              <a
                onClick={handleNavigateToActivities}
                className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                moje aktivnosti
              </a>
              <a
                onClick={handleNavigateToSaved}
                className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                spremljeno
              </a>
              <hr className="my-1 border-gray-300" />
              <a
                onClick={handleLogout}
                className="block px-4 py-2 text-red-600 hover:bg-gray-100 hover:rounded-b-lg cursor-pointer"
              >
                odjava
              </a>
            </div>
          )}
        </div>
      </nav>

      <img
        src="/images/menu.png"
        className="md:hidden size-10 cursor-pointer"
        onClick={toggleMenu}
      />

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
          <a href="#" className="block hover:text-white/80">
            aktivnosti
          </a>
          <a href="#" className="block hover:text-white/80">
            organizacije
          </a>
          <a href="#" className="block hover:text-white/80">
            o platformi
          </a>
          <hr className="border-gray-600" />
          <a onClick={handleNavigateToProfile} className="block hover:text-yellow-400 cursor-pointer">
            profil
          </a>
          <a onClick={handleNavigateToActivities} className="block hover:text-yellow-400 cursor-pointer">
            moje aktivnosti
          </a>
          <a onClick={handleNavigateToSaved} className="block hover:text-yellow-400 cursor-pointer">
            spremljeno
          </a>
          <a onClick={handleLogout} className="block hover:text-red-400 cursor-pointer">
            odjava
          </a>
        </nav>
      </div>
    </header>
  );
}

export default NavBarLoggedIn;
