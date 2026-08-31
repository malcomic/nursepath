export default function BlogPostLoading() {
  return (
    <main>
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16 animate-pulse">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-24 bg-white/20 rounded mb-4" />
          <div className="h-4 w-32 bg-white/20 rounded mb-4" />
          <div className="h-10 w-full max-w-2xl bg-white/20 rounded mb-4" />
          <div className="h-6 w-full max-w-xl bg-white/20 rounded" />
        </div>
      </section>
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full" />
          ))}
        </div>
      </section>
    </main>
  );
}
