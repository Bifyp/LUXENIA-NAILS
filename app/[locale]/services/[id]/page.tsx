interface Props {
  params: { id: string };
}

export default function ServicePage({ params }: Props) {
  const serviceName = {
    cleaning: "Чистка лица",
    peeling: "Пилинг",
    massage: "Массаж лица",
  }[params.id] || "Услуга";

  return (
    <div className="container py-24">
      <h1 className="text-4xl font-serif mb-6">{serviceName}</h1>

      <p className="text-graphite/70 font-sans max-w-2xl mb-10">
        Подробное описание услуги. Здесь можно указать методику, длительность,
        материалы, противопоказания и рекомендации.
      </p>

      <a href="/booking" className="btn-primary inline-block">
        Записаться
      </a>
    </div>
  );
}
