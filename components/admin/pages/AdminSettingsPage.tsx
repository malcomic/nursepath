'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useToast } from '@/components/admin/ToastProvider';
import { adminJson } from '@/lib/admin/api-client';

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
        const res = await adminJson<{ success: boolean; data: Settings }>('/api/admin/settings');
        setSettings(res.data);
      } catch {
        showToast('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [showToast]);

  const handleChange = (field: keyof Settings, value: string) => {
    if (!settings) return;
    let parsed: string | number = value;
    if (field === 'downloadExpiryHours' || field === 'maxDownloads') {
      parsed = value === '' ? 0 : Number(value);
    }
    setSettings({ ...settings, [field]: parsed });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      setSaving(true);
      await adminJson('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      showToast('Settings saved', 'success');
    } catch {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm max-w-3xl">
      <div className="px-6 py-5 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Store Settings</h2>
        <p className="text-sm text-slate-500">
          Control how digital orders are delivered and how payments are configured.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
        {loading || !settings ? (
          <div className="py-10 text-center text-sm text-slate-500">Loading settings...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Download expiry (hours)
                </label>
                <input
                  type="number"
                  min={1}
                  max={168}
                  value={settings.downloadExpiryHours}
                  onChange={(e) => handleChange('downloadExpiryHours', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
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
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Support email
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                <input
                  type="text"
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Payment provider
                </label>
                <input
                  type="text"
                  value={settings.paymentProvider || ''}
                  onChange={(e) => handleChange('paymentProvider', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">API key</label>
                <input
                  type="password"
                  value={settings.paymentApiKey || ''}
                  onChange={(e) => handleChange('paymentApiKey', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end">
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
  );
}
