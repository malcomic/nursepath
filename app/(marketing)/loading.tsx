export default function HomeLoading() {
  return (
    <main>
      <div className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 lg:py-32 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-8 w-64 bg-gray-200 rounded-full mx-auto mb-6" />
          <div className="h-16 w-full max-w-3xl bg-gray-200 rounded-lg mx-auto mb-6" />
          <div className="h-8 w-full max-w-2xl bg-gray-200 rounded-lg mx-auto mb-10" />
          <div className="flex justify-center gap-4">
            <div className="h-12 w-48 bg-gray-200 rounded-lg" />
            <div className="h-12 w-36 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-80 bg-gray-200 rounded-lg mb-4 animate-pulse" />
          <div className="h-6 w-96 bg-gray-200 rounded-lg mb-12 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
