import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve the token and role from the URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        const roleFromUrl = urlParams.get('role');

        // If token and role are found in the URL, save them in the state
        if (tokenFromUrl && roleFromUrl) {
            setToken(tokenFromUrl);
            setRole(roleFromUrl);
            // Optionally store them in localStorage for persistent login
            localStorage.setItem('jwt', tokenFromUrl);
            localStorage.setItem('role', roleFromUrl);

            // Redirect user to the correct page based on their role
            if (roleFromUrl === "ROLE_VOLUNTEER") {
                navigate("/volunteer/home");
            } else if (roleFromUrl === "ROLE_ORGANIZATION") {
                navigate("/organization/home");
            }
        }
    }, [navigate]);

    const googleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <div>
            <h2>Welcome to the OAuth demo</h2>
            <button onClick={googleLogin}>Login with Google</button>
        </div>
    );
};

export default Home;
