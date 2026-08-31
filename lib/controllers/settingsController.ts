import { z } from 'zod';
import { settingsService } from '@/lib/services/settingsService';

const updateSettingsSchema = z.object({
  downloadExpiryHours: z.number().int().min(1).max(168).optional(),
  maxDownloads: z.number().int().min(1).max(10).optional(),
  supportEmail: z.string().email().optional(),
  currency: z.string().min(1).max(10).optional(),
  paymentProvider: z.string().optional().nullable(),
  paymentApiKey: z.string().optional().nullable(),
});

function maskSettings(settings: Awaited<ReturnType<typeof settingsService.getSettings>>) {
  return {
    ...settings,
    paymentApiKey: settings.paymentApiKey ? '****' : null,
  };
}

export async function getSettings() {
  const settings = await settingsService.getSettings();
  return { success: true as const, data: maskSettings(settings) };
}

export async function updateSettings(body: unknown) {
  const parsed = updateSettingsSchema.parse(body);
  const updated = await settingsService.updateSettings(parsed);
  return { success: true as const, data: maskSettings(updated) };
}
