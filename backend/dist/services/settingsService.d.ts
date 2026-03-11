export interface SettingsInput {
    downloadExpiryHours?: number;
    maxDownloads?: number;
    supportEmail?: string;
    currency?: string;
    paymentProvider?: string | null;
    paymentApiKey?: string | null;
}
export declare class SettingsService {
    getSettings(): Promise<{
        id: string;
        downloadExpiryHours: number;
        maxDownloads: number;
        supportEmail: string;
        currency: string;
        paymentProvider: string | null;
        paymentApiKey: string | null;
    }>;
    updateSettings(input: SettingsInput): Promise<{
        id: string;
        downloadExpiryHours: number;
        maxDownloads: number;
        supportEmail: string;
        currency: string;
        paymentProvider: string | null;
        paymentApiKey: string | null;
    }>;
}
export declare const settingsService: SettingsService;
//# sourceMappingURL=settingsService.d.ts.map