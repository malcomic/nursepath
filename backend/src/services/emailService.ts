import { logger } from '../config/logger';

export interface DownloadEmailPayload {
  to: string;
  name: string;
  downloadUrl: string;
}

class EmailService {
  async sendDownloadEmail(payload: DownloadEmailPayload) {
    // Stub implementation: log to console / logger.
    // Replace with real email provider integration later.
    logger.info(
      `Sending download email to ${payload.to} for ${payload.name}: ${payload.downloadUrl}`
    );
  }
}

export const emailService = new EmailService();

