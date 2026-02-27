import AdminLayout from '../../components/layout/AdminLayout';

export default function AdminDashboardHomePage() {
  return (
    <AdminLayout title="Admin Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Guides
          </p>
          <p className="text-2xl font-black text-slate-900">Study Guides</p>
          <p className="text-xs text-slate-500 mt-2">
            Manage and publish digital study resources.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Orders
          </p>
          <p className="text-2xl font-black text-slate-900">Orders</p>
          <p className="text-xs text-slate-500 mt-2">
            Track purchases and secure downloads.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Settings
          </p>
          <p className="text-2xl font-black text-slate-900">Settings</p>
          <p className="text-xs text-slate-500 mt-2">
            Control payments, delivery, and support details.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-2">
          Welcome to ScholarWriters Admin
        </h2>
        <p className="text-sm text-slate-600 mb-3">
          Use the sidebar to manage guides, categories, and orders. Orders are
          guest-based and rely on secure expiring download links.
        </p>
      </div>
    </AdminLayout>
  );
}

