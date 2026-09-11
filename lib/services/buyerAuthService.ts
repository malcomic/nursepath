import { prisma } from '@/lib/prisma';
import { PaymentStatus } from '@/lib/generated/prisma/enums';
import { emailService } from '@/lib/services/emailService';
import { config } from '@/lib/config/env';
import { ApiError } from '@/lib/errors/api-error';
import {
  generateRawToken,
  hashToken,
  MAGIC_LINK_TTL_MS,
  signBuyerSession,
} from '@/lib/auth/buyer-session';
import { orderService } from '@/lib/services/orderService';

const GENERIC_REQUEST_MESSAGE =
  'If that email has purchases with us, a sign-in link is on the way. Check your inbox (and spam).';

export class BuyerAuthService {
  async requestMagicLink(emailRaw: string) {
    const email = emailRaw.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      throw new ApiError(400, 'A valid email is required');
    }

    const paidCount = await prisma.order.count({
      where: {
        customerEmail: { equals: email, mode: 'insensitive' },
        paymentStatus: PaymentStatus.PAID,
      },
    });

    if (paidCount === 0) {
      return { success: true as const, message: GENERIC_REQUEST_MESSAGE };
    }

    const raw = generateRawToken();
    const tokenHash = hashToken(raw);
    const expiresAt = new Date(Date.now() + MAGIC_LINK_TTL_MS);

    await prisma.buyerLoginToken.create({
      data: { email, tokenHash, expiresAt },
    });

    const baseUrl = config.publicAppUrl || 'http://localhost:3000';
    const magicUrl = `${baseUrl}/api/dashboard/verify?token=${encodeURIComponent(raw)}`;

    await emailService.sendMagicLinkEmail({ to: email, magicUrl });

    return { success: true as const, message: GENERIC_REQUEST_MESSAGE };
  }

  async consumeMagicLink(rawToken: string): Promise<{ sessionToken: string; email: string }> {
    if (!rawToken) {
      throw new ApiError(400, 'Missing token');
    }

    const tokenHash = hashToken(rawToken);
    const record = await prisma.buyerLoginToken.findUnique({ where: { tokenHash } });

    if (!record || record.usedAt || record.expiresAt.getTime() < Date.now()) {
      throw new ApiError(400, 'This sign-in link is invalid or has expired. Request a new one.');
    }

    await prisma.buyerLoginToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    });

    const email = record.email.toLowerCase();
    const sessionToken = signBuyerSession(email);
    return { sessionToken, email };
  }

  async listSessionOrders(email: string) {
    const orders = await prisma.order.findMany({
      where: {
        customerEmail: { equals: email.trim().toLowerCase(), mode: 'insensitive' },
        paymentStatus: PaymentStatus.PAID,
      },
      include: { guide: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return orders.map((order) => {
      const canDownload = orderService.canDownload(order);
      return {
        id: order.id,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        canDownload,
        downloadStatus: orderService.getDownloadStatus(order),
        downloadUrl: canDownload
          ? `/api/download/${encodeURIComponent(order.downloadToken)}`
          : null,
        guide: {
          id: order.guide.id,
          title: order.guide.title,
          description: order.guide.description,
          price: Number(order.guide.price),
          thumbnailUrl: order.guide.thumbnailUrl,
        },
      };
    });
  }
}

export const buyerAuthService = new BuyerAuthService();
