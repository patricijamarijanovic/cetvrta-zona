function Card({ title, organization, description, image }) {
   return (
     <a href="#">
       <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col">
         <img
           src={image}
           alt={title}
           className="rounded-lg object-cover h-40 w-full mb-4"
         />
         <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
         <p className="text-sm text-gray-500">{organization}</p>
         <p className="text-sm text-gray-700">{description}</p>
       </div>
     </a>
   );
 }
 
 export default Card;
 