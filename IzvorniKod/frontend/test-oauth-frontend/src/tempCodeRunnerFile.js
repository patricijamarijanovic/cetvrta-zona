import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BACK_URL = "backend-qns7.onrender.com";

const VolunteerHome = () => {
  // Dohvati token iz localStorage
  const token = localStorage.getItem('jwt');  // Koristi token iz localStorage
  const [volunteerData, setVolunteerData] = useState(null);

  useEffect(() => {
    if (!token) {
      console.error('Token not found');
      return;  // Ako token nije prisutan, ne šaljemo zahtjev
    }

    // Definiraj opcije za zahtjev
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://${BACK_URL}/volunteer/home`, {  // Provjeri ispravan endpoint
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setVolunteerData(response.data);  // Spremi podatke u state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div>
      <h1>Welcome to the Volunteer Home Page</h1>
    </div>
  );
};

export default VolunteerHome;
