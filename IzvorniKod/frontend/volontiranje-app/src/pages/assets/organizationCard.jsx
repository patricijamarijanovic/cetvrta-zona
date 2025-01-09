
function OrganizationCard({OrganizationName, image}) {
    return (
      <a href="#">
        <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-col">
          <img
            src={image}
            alt={`${OrganizationName}`}
            className="rounded-lg object-cover h-40 w-full mb-4"
          />
          <h2 className="text-lg font-semibold text-gray-800">{OrganizationName}</h2>
        </div>
      </a>
    );
  }
  
  export default OrganizationCard;
  