import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VolunteerHome = () => {
  const token = localStorage.getItem('jwt');  // Get the token from localStorage
  
  const [error, setError] = useState(null);  // State for error handling

  const [volunteerData, setVolunteerData] = useState(null);

  useEffect(() => {
    if (!token) {
      console.error('Token not found');
      return;  // If the token is not present, don't send the request
    }

    

    console.log("token pronaden: ", token)

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/volunteer/home', {  
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setVolunteerData(response.data);  // Store the data in state
        setError(null);  // Reset error if request is successful
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('ne smiješ ovdje :/');  // Set error message if request fails
      }
    };

    fetchData();
  }, [token]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Welcome to the Volunteer Home Page</h1>
      {volunteerData && (
        <div>
          <h3>Volunteer Data:</h3>
          <pre>{JSON.stringify(volunteerData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default VolunteerHome;
