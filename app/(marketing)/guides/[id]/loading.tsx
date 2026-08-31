export default function GuideLoading() {
  return (
    <main className="bg-gray-50">
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
                <div className="h-6 w-24 bg-gray-200 rounded mb-4" />
                <div className="h-12 w-full bg-gray-200 rounded mb-4" />
                <div className="h-20 w-full bg-gray-200 rounded" />
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-6" />
                <div className="h-10 w-32 bg-gray-200 rounded mb-4" />
                <div className="h-12 w-full bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
