import { prisma } from '@/lib/prisma';
import type { Purchase } from '@/lib/types';

export class PurchaseRepository {
  async findAll(): Promise<(Purchase & { guide: unknown })[]> {
    return prisma.purchase.findMany({
      include: { guide: true },
      orderBy: { purchasedAt: 'desc' },
    });
  }

  async findByGuideId(guideId: string): Promise<Purchase[]> {
    return prisma.purchase.findMany({
      where: { guideId },
      orderBy: { purchasedAt: 'desc' },
    });
  }

  async findByEmail(email: string): Promise<(Purchase & { guide: unknown })[]> {
    return prisma.purchase.findMany({
      where: { buyerEmail: email },
      include: { guide: true },
      orderBy: { purchasedAt: 'desc' },
    });
  }

  async create(guideId: string, buyerName: string, buyerEmail: string): Promise<Purchase> {
    return prisma.purchase.create({
      data: { guideId, buyerName, buyerEmail },
    });
  }
}

export const purchaseRepository = new PurchaseRepository();
