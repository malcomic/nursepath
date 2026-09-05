interface PageHeroProps {
  title: string;
  description?: string;
}

export default function PageHero({ title, description }: PageHeroProps) {
  return (
    <section className="bg-navy-800 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-4 font-display text-4xl font-extrabold sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && <p className="max-w-2xl text-xl text-navy-200">{description}</p>}
      </div>
    </section>
  );
}
