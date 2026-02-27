import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { PaymentStatus } from '../generated/prisma/enums';
import { asyncHandler, ApiError } from '../middleware/errorHandler';

const router = Router();

router.get(
  '/:token',
  asyncHandler(async (req, res) => {
    const { token } = req.params;

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
      data: {
        downloadCount: { increment: 1 },
      },
    });

    // For now, redirect directly to the PDF URL.
    // Later this can be replaced by signed URLs or proxied downloads.
    return res.redirect(order.guide.pdfUrl);
  })
);

export default router;

