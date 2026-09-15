'use client';

import { useCallback, useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/admin/ToastProvider';
import { adminJson } from '@/lib/admin/api-client';

interface PlanRow {
  id: string;
  code: string;
  name: string;
  description: string | null;
  durationDays: number;
  priceUsd: number;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminPlansPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<PlanRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<PlanRow | null>(null);
  const [priceUsd, setPriceUsd] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminJson<{ success: boolean; data: { items: PlanRow[] } }>(
        '/api/admin/plans'
      );
      setItems(res.data.items);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to load plans', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const openEdit = (plan: PlanRow) => {
    setEditing(plan);
    setPriceUsd(String(plan.priceUsd));
    setDescription(plan.description ?? '');
    setIsActive(plan.isActive);
  };

  const save = async () => {
    if (!editing) return;
    const price = Number(priceUsd);
    if (Number.isNaN(price) || price < 0) {
      showToast('Enter a valid price', 'error');
      return;
    }
    try {
      setSaving(true);
      await adminJson(`/api/admin/plans/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceUsd: price,
          isActive,
          description: description.trim() || null,
        }),
      });
      showToast('Plan updated', 'success');
      setEditing(null);
      await fetchItems();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update plan', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-navy-400">
        Edit plan price, description, and active flag. Duration and code are fixed.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-soft/60 text-xs uppercase tracking-wide text-navy-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Code</th>
              <th className="px-4 py-3 font-semibold">Duration</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Active</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-navy-400">
                  Loading…
                </td>
              </tr>
            ) : (
              items.map((plan) => (
                <tr key={plan.id} className="hover:bg-soft/40">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-navy-800">{plan.name}</div>
                    {plan.description && (
                      <div className="mt-0.5 line-clamp-1 text-xs text-navy-400">
                        {plan.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-navy-500">{plan.code}</td>
                  <td className="px-4 py-3 text-navy-600">{plan.durationDays}d</td>
                  <td className="px-4 py-3 font-semibold text-navy-800">
                    ${Number(plan.priceUsd).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        plan.isActive
                          ? 'bg-green-50 text-green-700'
                          : 'bg-navy-50 text-navy-500'
                      }`}
                    >
                      {plan.isActive ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(plan)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-primary-600 hover:bg-primary-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing ? `Edit ${editing.name}` : 'Edit plan'}
      >
        {editing && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-navy-700">
                Price (USD)
              </label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={priceUsd}
                onChange={(e) => setPriceUsd(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-navy-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-navy-800"
              />
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-navy-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              Active (shown on pricing)
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button onClick={() => void save()} isLoading={saving}>
                Save
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
