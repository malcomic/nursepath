import { prisma } from '@/lib/prisma';
import { PaymentStatus } from '@/lib/generated/prisma/enums';
import { ApiError } from '@/lib/errors/api-error';

export async function processDownload(token: string) {
  const order = await prisma.order.findUnique({
    where: { downloadToken: token },
    include: { guide: true },
  });

  if (!order) {
    throw new ApiError(404, 'Download link not found');
  }

  const now = new Date();
  const isExpired =
    order.downloadExpiresAt <= now || order.downloadCount >= order.maxDownloads;
  const isPaid = order.paymentStatus === PaymentStatus.PAID;
  const notRefunded = order.paymentStatus !== PaymentStatus.REFUNDED;

  if (!isPaid || !notRefunded || isExpired) {
    throw new ApiError(410, 'Download link has expired or is no longer valid');
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { downloadCount: { increment: 1 } },
  });

  return order.guide.pdfUrl;
}
