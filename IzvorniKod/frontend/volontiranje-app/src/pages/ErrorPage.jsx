import React from 'react';
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
   const navigate = useNavigate();

   return (

     <div className="p-8 bg-slate-600 rounded-b-3xl text-white">
       <h2 className="font-bold text-5xl">Pristup odbijen</h2>
       <p className="text-xl py-2">
         Provjerite jeste li tražili baš tu lokaciju?
       </p>
       <button
         className="bg-yellow-300 text-black py-2 px-4 rounded-s-3xl rounded-e-3xl hover:bg-yellow-400"
         onClick={() => navigate(-1)}
       >
         Povratak
       </button>
     </div>
   );
 }

export default ErrorPage;