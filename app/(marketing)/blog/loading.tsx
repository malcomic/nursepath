export default function BlogLoading() {
  return (
    <main>
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-12 w-full max-w-md bg-white/20 rounded-lg mb-4" />
          <div className="h-6 w-full max-w-xl bg-white/20 rounded-lg" />
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 p-8 animate-pulse"
            >
              <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
              <div className="h-8 w-full max-w-lg bg-gray-200 rounded mb-3" />
              <div className="h-20 bg-gray-200 rounded mb-4" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
