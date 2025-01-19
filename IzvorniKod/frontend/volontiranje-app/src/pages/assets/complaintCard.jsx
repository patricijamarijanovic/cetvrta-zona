function complaintCard({ title, date, firstName, lastName }) {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("hr-HR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className={`shadow-md p-4 flex flex-col  "bg-gray-100"`}>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <h3 className="text-sm text-gray-500  tracking-wide">
          {formatDate(date)}
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          {firstName} {lastName}
        </p>
      </div>
    </div>
  );
}

export default complaintCard;
