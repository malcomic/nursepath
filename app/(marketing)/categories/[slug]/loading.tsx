export default function CategoryLoading() {
  return (
    <main>
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-12 w-80 bg-white/20 rounded-lg mb-4" />
          <div className="h-6 w-full max-w-2xl bg-white/20 rounded-lg" />
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
