function Card({
  title,
  location,
  startDate,
  endDate,
  image,
  organization,
  urgency,
  category,
}) {
  const formatCategory = (cat) => {
    const categoryMap = {
      ZIVOTINJE: "ŽIVOTINJE",
      OKOLIS: "OKOLIŠ",
    };
    const mappedCategory = categoryMap[cat];
    if (mappedCategory) return mappedCategory;

    return cat;
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatLocation = (loc) =>
    loc
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  return (
    <div className="rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-40 object-cover" />
        <div className="absolute top-2 right-2 bg-white bg-opacity-75 text-gray-800 font-bold text-xs px-2 py-1 rounded">
          {formatCategory(category)}
        </div>
      </div>

      <div
        className={`shadow-md p-4 flex flex-col ${
          urgency ? "bg-red-100" : "bg-gray-100"
        }`}
      >
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <h3 className="text-sm text-gray-500 font-bold tracking-wide">
          {formatLocation(location)}
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          <strong>Organizacija:</strong> {organization}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          <strong>Vrijeme:</strong> {formatDate(startDate)} -{" "}
          {formatDate(endDate)}
        </p>
      </div>
    </div>
  );
}

export default Card;
