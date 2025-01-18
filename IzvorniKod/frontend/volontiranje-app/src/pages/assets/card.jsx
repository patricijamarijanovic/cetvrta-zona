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
      ZIVOTINJE: "Životinje",
      OKOLIS: "Okoliš",
    };
    const mappedCategory = categoryMap[cat];
    if (mappedCategory) return mappedCategory;

    return cat.charAt(0) + cat.slice(1).toLowerCase();
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("hr-HR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const formatLocation = (loc) =>
      loc
        .split(" ") // Razdvajanje riječi
        .map(
          (word) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Prvo slovo veliko, ostala mala
        )
        .join(" ");

  return (
    <div className={`rounded-lg shadow-md p-6 flex flex-col ${urgency ? "bg-red-100" : "bg-gray-100"}`}>
      <img
        src={image}
        alt={title}
        className="rounded-lg object-cover h-40 w-full mb-4"
      />

      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

      <h3 className="text-sm font-semibold text-gray-500">{organization}</h3>

      <p className="text-sm text-gray-500">{formatLocation(location)}</p>

      <p className="text-sm text-green-600">
        Početak: {formatDate(startDate)}
      </p>

      <p className="text-sm text-red-600">Kraj: {formatDate(endDate)}</p>

      <p className="text-sm text-gray-600">{formatCategory(category)}</p>
    </div>
  );
}

export default Card;
