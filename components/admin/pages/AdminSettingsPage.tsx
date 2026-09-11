'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useToast } from '@/components/admin/ToastProvider';
import { adminJson } from '@/lib/admin/api-client';

interface Settings {
  downloadExpiryHours: number;
  maxDownloads: number;
  supportEmail: string;
  currency: string;
  usdToKesRate: number;
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
    if (
      field === 'downloadExpiryHours' ||
      field === 'maxDownloads' ||
      field === 'usdToKesRate'
    ) {
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
    <div className="bg-white border border-border rounded-2xl shadow-soft max-w-3xl">
      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-lg font-bold text-navy-800">Store Settings</h2>
        <p className="text-sm text-navy-400">
          Control how digital orders are delivered and how payments are configured.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
        {loading || !settings ? (
          <div className="py-10 text-center text-sm text-navy-400">Loading settings...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">
                  Download expiry (hours)
                </label>
                <input
                  type="number"
                  min={1}
                  max={168}
                  value={settings.downloadExpiryHours}
                  onChange={(e) => handleChange('downloadExpiryHours', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">
                  Max downloads per order
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={settings.maxDownloads}
                  onChange={(e) => handleChange('maxDownloads', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">
                  Support email
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Currency</label>
                <input
                  type="text"
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">
                  USD to KES rate
                </label>
                <input
                  type="number"
                  min={1}
                  step={0.0001}
                  value={settings.usdToKesRate}
                  onChange={(e) => handleChange('usdToKesRate', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm"
                />
                <p className="mt-1 text-xs text-navy-400">
                  Used to convert USD catalog prices when buyers pay with M-Pesa.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">
                  Payment provider
                </label>
                <input
                  type="text"
                  value={settings.paymentProvider || ''}
                  onChange={(e) => handleChange('paymentProvider', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">API key</label>
                <input
                  type="password"
                  value={settings.paymentApiKey || ''}
                  onChange={(e) => handleChange('paymentApiKey', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60"
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
