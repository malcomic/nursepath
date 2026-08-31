import { prisma } from '@/lib/prisma';
import { ApiError } from '@/lib/errors/api-error';

export interface SettingsInput {
  downloadExpiryHours?: number;
  maxDownloads?: number;
  supportEmail?: string;
  currency?: string;
  paymentProvider?: string | null;
  paymentApiKey?: string | null;
}

export class SettingsService {
  async getSettings() {
    let settings = await prisma.settings.findUnique({ where: { id: 'global' } });
    if (!settings) {
      settings = await prisma.settings.create({ data: {} });
    }
    return settings;
  }

  async updateSettings(input: SettingsInput) {
    const current = await this.getSettings();

    if (
      input.downloadExpiryHours !== undefined &&
      (input.downloadExpiryHours < 1 || input.downloadExpiryHours > 168)
    ) {
      throw new ApiError(400, 'downloadExpiryHours must be between 1 and 168');
    }

    if (
      input.maxDownloads !== undefined &&
      (input.maxDownloads < 1 || input.maxDownloads > 10)
    ) {
      throw new ApiError(400, 'maxDownloads must be between 1 and 10');
    }

    return prisma.settings.update({
      where: { id: current.id },
      data: {
        downloadExpiryHours: input.downloadExpiryHours ?? current.downloadExpiryHours,
        maxDownloads: input.maxDownloads ?? current.maxDownloads,
        supportEmail: input.supportEmail ?? current.supportEmail,
        currency: input.currency ?? current.currency,
        paymentProvider:
          input.paymentProvider !== undefined ? input.paymentProvider : current.paymentProvider,
        paymentApiKey:
          input.paymentApiKey !== undefined ? input.paymentApiKey : current.paymentApiKey,
      },
    });
  }
}

export const settingsService = new SettingsService();
