import { Resend } from 'resend';
import { config } from '@/lib/config/env';
import { logger } from '@/lib/config/logger';

export interface DownloadEmailPayload {
  to: string;
  name: string;
  downloadUrl: string;
  guideTitle: string;
}

export interface ContactEmailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

class EmailService {
  private resend: Resend | null = null;

  private getClient(): Resend | null {
    if (!config.resendApiKey) return null;
    if (!this.resend) {
      this.resend = new Resend(config.resendApiKey);
    }
    return this.resend;
  }

  async sendDownloadEmail(payload: DownloadEmailPayload) {
    const subject = `Your NursePath download: ${payload.guideTitle}`;
    const html = `
      <p>Hi ${escapeHtml(payload.name)},</p>
      <p>Thank you for your purchase! Your study guide <strong>${escapeHtml(payload.guideTitle)}</strong> is ready to download.</p>
      <p><a href="${escapeHtml(payload.downloadUrl)}">Download your guide</a></p>
      <p>This link expires after the download limit is reached. If you need help, reply to this email.</p>
      <p>— NursePath</p>
    `;

    const client = this.getClient();
    if (!client) {
      logger.info(
        `[email stub] Download email to ${payload.to} for "${payload.guideTitle}": ${payload.downloadUrl}`
      );
      return;
    }

    const { error } = await client.emails.send({
      from: config.contactFromEmail,
      to: payload.to,
      subject,
      html,
    });

    if (error) {
      logger.error('Failed to send download email:', error);
      throw new Error('Failed to send download email');
    }
  }

  async sendMultiDownloadEmail(payload: {
    to: string;
    name: string;
    items: Array<{ guideTitle: string; downloadUrl: string }>;
  }) {
    if (payload.items.length === 1) {
      return this.sendDownloadEmail({
        to: payload.to,
        name: payload.name,
        guideTitle: payload.items[0].guideTitle,
        downloadUrl: payload.items[0].downloadUrl,
      });
    }

    const list = payload.items
      .map(
        (item) =>
          `<li><strong>${escapeHtml(item.guideTitle)}</strong> — <a href="${escapeHtml(item.downloadUrl)}">Download</a></li>`
      )
      .join('');

    const subject = `Your NursePath downloads (${payload.items.length} guides)`;
    const html = `
      <p>Hi ${escapeHtml(payload.name)},</p>
      <p>Thank you for your purchase! Your study guides are ready to download:</p>
      <ul>${list}</ul>
      <p>These links expire after the download limit is reached. If you need help, reply to this email.</p>
      <p>— NursePath</p>
    `;

    const client = this.getClient();
    if (!client) {
      logger.info(
        `[email stub] Multi-download email to ${payload.to}: ${payload.items.map((i) => i.downloadUrl).join(', ')}`
      );
      return;
    }

    const { error } = await client.emails.send({
      from: config.contactFromEmail,
      to: payload.to,
      subject,
      html,
    });

    if (error) {
      logger.error('Failed to send multi-download email:', error);
      throw new Error('Failed to send download email');
    }
  }

  async sendContactEmail(payload: ContactEmailPayload) {
    const subject = `[Contact] ${payload.subject}`;
    const html = `
      <p><strong>From:</strong> ${escapeHtml(payload.name)} &lt;${escapeHtml(payload.email)}&gt;</p>
      <p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>
      <hr />
      <p>${escapeHtml(payload.message).replace(/\n/g, '<br />')}</p>
    `;

    const client = this.getClient();
    if (!client) {
      logger.info(
        `[email stub] Contact from ${payload.email}: ${payload.subject}\n${payload.message}`
      );
      return;
    }

    const { error } = await client.emails.send({
      from: config.contactFromEmail,
      to: config.contactToEmail,
      replyTo: payload.email,
      subject,
      html,
    });

    if (error) {
      logger.error('Failed to send contact email:', error);
      throw new Error('Failed to send contact email');
    }
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const emailService = new EmailService();
