import Card from "./card";

function ActivitiesList() {
  const activities = [
    {
      title: "Aktivnost 1",
      organization: "Organizacija 1",
      description:
        "pomoc pri pomoc pri pomoc pri pomoc pri pomoc pri pomoc pri pomoc pri ",
      image: "/images/cat.jpg",
    },
    {
      title: "Aktivnost 2",
      organization: "Organizacija 2",
      description:
        "description description description description description description description description description description ",
      image: "/images/cat.jpg",
    },
    {
      title: "Aktivnost 3",
      organization: "Organizacija",
      description: "info info info info info info info ",
      image: "/images/dog.jpg",
    },
    {
      title: "Aktivnost 4",
      organization: "Organizacija 4",
      description:
        "treba ovo ono treba ovo ono treba ovo ono treba ovo ono treba ovo ono treba ovo ono treba ovo ono treba ovo ono ",
      image: "/images/cat.jpg",
    },
    {
      title: "Aktivnost 5",
      organization: "Organizacija 5",
      description:
        "nesto nesto nesto nesto nesto nesto nesto nesto nesto nesto ",
      image: "/images/dog.jpg",
    },
  ];

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Aktualno</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.length === 0 ? (
          <h1>Na žalost trenutno nema dostupnih aktivnosti :'( </h1>
        ) : (
          activities.map((activity, index) => (
            <Card
              key={index}
              title={activity.title}
              organization={activity.organization}
              description={activity.description}
              image={activity.image}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default ActivitiesList;
