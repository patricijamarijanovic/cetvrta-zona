import React from 'react';
import { useNavigate } from 'react-router-dom';


function NotAuthorized() {
    const navigate = useNavigate();

    return (
        <div className="not-authorized">
            <h2>Stranica nije dostupna</h2>
            <p>Nemate potrebna dopuštenja za pristup ovoj stranici.</p>
            <button onClick={() => navigate(-1)}>Povratak</button>
        </div>
    );
}

export default NotAuthorized;