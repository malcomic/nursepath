export interface DownloadEmailPayload {
    to: string;
    name: string;
    downloadUrl: string;
}
declare class EmailService {
    sendDownloadEmail(payload: DownloadEmailPayload): Promise<void>;
}
export declare const emailService: EmailService;
export {};
//# sourceMappingURL=emailService.d.ts.map