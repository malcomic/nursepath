import { prisma } from '@/lib/prisma';

export class SubscriptionDownloadRepository {
  async countForSubscription(subscriptionId: string): Promise<number> {
    return prisma.subscriptionDownload.count({ where: { subscriptionId } });
  }

  async findOne(subscriptionId: string, contentDocumentId: string) {
    return prisma.subscriptionDownload.findUnique({
      where: {
        subscriptionId_contentDocumentId: {
          subscriptionId,
          contentDocumentId,
        },
      },
    });
  }

  async listContentIds(subscriptionId: string): Promise<string[]> {
    const rows = await prisma.subscriptionDownload.findMany({
      where: { subscriptionId },
      select: { contentDocumentId: true },
    });
    return rows.map((r) => r.contentDocumentId);
  }

  async create(subscriptionId: string, contentDocumentId: string) {
    return prisma.subscriptionDownload.create({
      data: { subscriptionId, contentDocumentId },
    });
  }
}

export const subscriptionDownloadRepository = new SubscriptionDownloadRepository();
