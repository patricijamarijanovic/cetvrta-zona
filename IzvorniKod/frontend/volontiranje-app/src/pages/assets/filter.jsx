import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// const BACK_URL = "backend-qns7.onrender.com";
// const BACK_URL = "https://backend-qns7.onrender.com";
const BACK_URL = "http://localhost:8080";

function Filter({ setFilteredActivities, setIsFiltered }) {
  const token = localStorage.getItem("token");
  const [placeholder, setPlaceholder] = useState("Unesite lokaciju");

  useEffect(() => {
    // Provjeri ima li spremljenog filtera u localStorage
    const savedFilters = JSON.parse(localStorage.getItem("filters"));
    if (savedFilters) {
      setFilterData({
        location: savedFilters.location || "",
        typeofwork: savedFilters.typeofwork || "",
        startDate: savedFilters.startDate || "",
        enddate: savedFilters.enddate || "",
      });

      if (savedFilters.typeofwork) {
        const mappedCategory =
          savedFilters.typeofwork === "OKOLIS"
            ? "OKOLIŠ"
            : savedFilters.typeofwork === "ZIVOTINJE"
            ? "ŽIVOTINJE"
            : savedFilters.typeofwork;
        setSelectedCategory(mappedCategory);
      }
    }
  }, []);
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

  const [filterData, setFilterData] = useState({
    location: null,
    typeofwork: null,
    startDate: null,
    enddate: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterData({ ...filterData, [name]: value });
  };

  const resetFilters = () => {
    setFilterData({
      location: null,
      typeofwork: null,
      startDate: null,
      enddate: null,
    });
    setSelectedCategory("");
    localStorage.removeItem("filters");
    setFilteredActivities([]);
    setIsFiltered(false);
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    localStorage.setItem("filters", JSON.stringify(filterData));
    if (filterData.typeofwork === "OKOLIŠ") {
      filterData.typeofwork = "OKOLIS";
    }
    if (filterData.typeofwork === "ŽIVOTINJE") {
      filterData.typeofwork = "ZIVOTINJE";
    }

    console.log(filterData);

    try {
      const response = await axios.post(`${BACK_URL}/home/activities/filter`, {
        typeOfWork: filterData.typeofwork,
        projectLocation: filterData.location,
        startDate: filterData.startDate,
        endDate: filterData.enddate,
      });
      console.log("USPJESNO FILTRIRANJE!!");
      console.log("U FILTERU ");
      console.log(response.data);

      setFilteredActivities(response.data);
      setIsFiltered(true);
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
  };

  const handleCategoryChange = (category) => {
    if (category === "OKOLIŠ") {
      setSelectedCategory("OKOLIS");
    } else if (category === "ŽIVOTINJE") {
      setSelectedCategory("ZIVOTINJE");
    } else {
      setSelectedCategory(category);
    }

    setFilterData({
      ...filterData,
      typeofwork: category,
    });

    setCategoryDropdownOpen(false);
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg mx-auto">
      <h2 className="text-white text-xl font-semibold mb-4">
        Filtriraj Aktivnosti
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex-1">
            <label htmlFor="location" className="block text-white mb-2">
              Lokacija:
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={filterData.location}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full p-2 rounded border border-gray-400 bg-gray-700 text-white"
            />
          </div>

          <div className="flex-1">
            <label className="block text-white mb-2">
              Kategorija projekta:
            </label>
            <div className="relative" onClick={toggleCategoryDropdown}>
              <div
                className={`border rounded p-2 cursor-pointer border-gray-400 bg-gray-700 flex justify-between items-center ${
                  selectedCategory ? "text-white" : "text-gray-400"
                }`}
              >
                <span>{selectedCategory || "odaberite kategoriju"}</span>
                <img
                  src="/images/one-down-arrow-white.png"
                  alt="Arrow"
                  className="w-4 h-4"
                />
              </div>
              {categoryDropdownOpen && (
                <div className="absolute z-10 bg-white shadow-lg rounded-lg mt-2 w-full border max-h-60 overflow-y-auto">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className="p-3 cursor-pointer hover:bg-gray-200 text-black"
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <label htmlFor="startDate" className="block text-white mb-2">
              Početni datum:
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filterData.startDate}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-400 bg-gray-700 text-white"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="enddate" className="block text-white mb-2">
              Završni datum:
            </label>
            <input
              type="date"
              id="enddate"
              name="enddate"
              value={filterData.enddate}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-400 bg-gray-700 text-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-yellow-500 text-gray-800 font-semibold hover:bg-yellow-600"
          >
            Filtriraj
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Odbaci filtere
          </button>
        </div>
      </form>
    </div>
  );
}

export default Filter;
