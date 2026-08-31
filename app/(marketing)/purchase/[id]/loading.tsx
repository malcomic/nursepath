export default function PurchaseLoading() {
  return (
    <main className="bg-gray-50 flex-grow py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="h-5 w-20 bg-gray-200 rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-8">
            <div className="h-10 w-64 bg-gray-200 rounded mb-8" />
            <div className="space-y-4">
              <div className="h-12 w-full bg-gray-200 rounded" />
              <div className="h-12 w-full bg-gray-200 rounded" />
              <div className="h-14 w-full bg-gray-200 rounded mt-6" />
            </div>
          </div>
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 p-8">
            <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
            <div className="h-20 w-full bg-gray-200 rounded mb-6" />
            <div className="h-8 w-full bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </main>
  );
}
