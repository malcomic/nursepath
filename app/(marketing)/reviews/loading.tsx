export default function ReviewsLoading() {
  return (
    <main className="bg-slate-50">
      <section className="bg-slate-900 py-16 sm:py-20 animate-pulse">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="h-6 w-40 bg-white/10 rounded-full mx-auto mb-4" />
          <div className="h-12 w-full max-w-xl bg-white/10 rounded-lg mx-auto mb-4" />
          <div className="h-6 w-full max-w-md bg-white/10 rounded-lg mx-auto" />
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse"
              >
                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-3 w-32 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="h-20 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
