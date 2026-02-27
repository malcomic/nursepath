import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { api } from '../../api';
import { useToast } from '../../components/admin/ToastProvider';

interface Settings {
  downloadExpiryHours: number;
  maxDownloads: number;
  supportEmail: string;
  currency: string;
  paymentProvider?: string | null;
  paymentApiKey?: string | null;
}

export default function AdminSettingsPage() {
  const { showToast } = useToast();

  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/settings', true);
        setSettings(res.data);
      } catch (error) {
        console.error('Failed to load settings:', error);
        showToast('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [showToast]);

  const handleChange = (field: keyof Settings, value: string) => {
    if (!settings) return;
    let parsed: any = value;
    if (field === 'downloadExpiryHours' || field === 'maxDownloads') {
      parsed = value === '' ? '' : Number(value);
    }
    setSettings({
      ...settings,
      [field]: parsed,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      const payload: any = {
        downloadExpiryHours: settings.downloadExpiryHours,
        maxDownloads: settings.maxDownloads,
        supportEmail: settings.supportEmail,
        currency: settings.currency,
        paymentProvider: settings.paymentProvider,
        paymentApiKey: settings.paymentApiKey,
      };
      await api.put('/admin/settings', payload, true);
      showToast('Settings saved', 'success');
    } catch (error) {
      console.error('Failed to save settings:', error);
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Settings">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm max-w-3xl">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Store Settings</h2>
          <p className="text-sm text-slate-500">
            Control how digital orders are delivered and how payments are configured.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
          {loading || !settings ? (
            <div className="py-10 text-center text-sm text-slate-500">
              Loading settings...
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Downloads
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Download expiry (hours)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={168}
                      value={settings.downloadExpiryHours}
                      onChange={(e) =>
                        handleChange('downloadExpiryHours', e.target.value)
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      How long a download link stays valid after generation.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Max downloads per order
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={settings.maxDownloads}
                      onChange={(e) => handleChange('maxDownloads', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Number of times a customer can download a guide.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Support &amp; Currency
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Support email
                    </label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => handleChange('supportEmail', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Currency
                    </label>
                    <input
                      type="text"
                      value={settings.currency}
                      onChange={(e) => handleChange('currency', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      ISO currency code, e.g. USD.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Payment Provider
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Provider name
                    </label>
                    <input
                      type="text"
                      placeholder="Stripe, Paystack, etc."
                      value={settings.paymentProvider || ''}
                      onChange={(e) =>
                        handleChange('paymentProvider', e.target.value)
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      API key (stored securely)
                    </label>
                    <input
                      type="password"
                      value={settings.paymentApiKey || ''}
                      onChange={(e) =>
                        handleChange('paymentApiKey', e.target.value)
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      This value is not exposed to customers; it is masked in the UI.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save settings'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}

