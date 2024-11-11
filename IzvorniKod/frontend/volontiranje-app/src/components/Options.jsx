import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

function Options() {
    const navigate = useNavigate();

    const handleClick1 = () => navigate('/register/volunteer');
    const handleClick2 = () => navigate('/register/organization');

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Tu je token!!' + token)
        if (token) {
          console.log("idemo")
          navigate('/not-authorized', { replace: true });
    
          return;
        }
    
        
      }, [navigate]); 

    return (
        <>
            <h1>Odaberite vrstu korisničkog računa:</h1>
            <button type="button" onClick={handleClick1}>Volonter</button>
            <button type="button" onClick={handleClick2}>Organizacija</button>
        </>
    );
}

export default Options;