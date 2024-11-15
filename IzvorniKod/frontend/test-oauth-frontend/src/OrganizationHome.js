import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrganizationHome = () => {
  const token = localStorage.getItem('jwt');  // Get the token from localStorage
  const [organizationData, setOrganizationData] = useState(null);
  const [error, setError] = useState(null);  // State for error handling



  useEffect(() => {
    if (!token) {
      console.error('Token not found');
      return;  // If the token is not present, don't send the request
    }

    console.log("token pronaden: ", token)

    const fetchData = async () => {
      try {
        const response = await axios.get('http://${BACK_URL}:8080/organization/home', {  
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setOrganizationData(response.data);  // Store the data in state
        setError(null);  // Reset error if request is successful
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('ne smiješ ovdje :/');  // Set error message if request fails
      }
    };

    fetchData();
  }, [token]);

  // If there's an error, render the error message
  if (error) {
    return <div>{error}</div>;
  }

  // If no organization data yet, render a loading message
  if (!organizationData) {
    return <div>Loading...</div>;
  }

  // Render the organization home page once data is fetched
  return (
    <div>
      <h1>Welcome to the Organization Home Page</h1>
      <div>
        <h3>Organization Data:</h3>
        <pre>{JSON.stringify(organizationData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default OrganizationHome;
