import { prisma } from '@/lib/prisma';
import type { SubscriptionStatus } from '@/lib/generated/prisma/enums';
import type { PlanRecord } from '@/lib/repositories/planRepository';

export type SubscriptionWithPlan = {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startsAt: Date | null;
  endsAt: Date | null;
  paymentReference: string | null;
  paymentProvider: string | null;
  amountUsd: number;
  expiryReminderSentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  plan: PlanRecord;
};

function mapSubscription(row: {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startsAt: Date | null;
  endsAt: Date | null;
  paymentReference: string | null;
  paymentProvider: string | null;
  amountUsd: { toString(): string } | number;
  expiryReminderSentAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  plan: {
    id: string;
    code: string;
    name: string;
    description: string | null;
    durationDays: number;
    priceUsd: { toString(): string } | number;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
  };
}): SubscriptionWithPlan {
  return {
    id: row.id,
    userId: row.userId,
    planId: row.planId,
    status: row.status,
    startsAt: row.startsAt,
    endsAt: row.endsAt,
    paymentReference: row.paymentReference,
    paymentProvider: row.paymentProvider,
    amountUsd: Number(row.amountUsd),
    expiryReminderSentAt: row.expiryReminderSentAt ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    plan: {
      ...row.plan,
      priceUsd: Number(row.plan.priceUsd),
    },
  };
}

export class SubscriptionRepository {
  async create(data: {
    userId: string;
    planId: string;
    status: SubscriptionStatus;
    amountUsd: number;
    paymentProvider?: string | null;
    paymentReference?: string | null;
  }) {
    const row = await prisma.subscription.create({
      data: {
        userId: data.userId,
        planId: data.planId,
        status: data.status,
        amountUsd: data.amountUsd,
        paymentProvider: data.paymentProvider ?? null,
        paymentReference: data.paymentReference ?? null,
      },
      include: { plan: true },
    });
    return mapSubscription(row);
  }

  async findById(id: string): Promise<SubscriptionWithPlan | null> {
    const row = await prisma.subscription.findUnique({
      where: { id },
      include: { plan: true },
    });
    return row ? mapSubscription(row) : null;
  }

  async findByPaymentReference(reference: string): Promise<SubscriptionWithPlan | null> {
    const row = await prisma.subscription.findUnique({
      where: { paymentReference: reference },
      include: { plan: true },
    });
    return row ? mapSubscription(row) : null;
  }

  async update(
    id: string,
    data: {
      status?: SubscriptionStatus;
      startsAt?: Date | null;
      endsAt?: Date | null;
      paymentReference?: string | null;
      paymentProvider?: string | null;
      expiryReminderSentAt?: Date | null;
    }
  ) {
    const row = await prisma.subscription.update({
      where: { id },
      data,
      include: { plan: true },
    });
    return mapSubscription(row);
  }

  async findLatestActiveEndsAt(userId: string): Promise<Date | null> {
    const now = new Date();
    const row = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        endsAt: { gt: now },
      },
      orderBy: { endsAt: 'desc' },
      select: { endsAt: true },
    });
    return row?.endsAt ?? null;
  }

  async findActiveForUser(userId: string): Promise<SubscriptionWithPlan[]> {
    const now = new Date();
    const rows = await prisma.subscription.findMany({
      where: {
        userId,
        status: 'ACTIVE',
        endsAt: { gt: now },
      },
      include: { plan: true },
      orderBy: { endsAt: 'desc' },
    });
    return rows.map(mapSubscription);
  }

  /** Currently running pass: started and not yet ended. Prefer latest startsAt. */
  async findInForceForUser(userId: string): Promise<SubscriptionWithPlan | null> {
    const now = new Date();
    const row = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        startsAt: { lte: now },
        endsAt: { gt: now },
      },
      include: { plan: true },
      orderBy: { startsAt: 'desc' },
    });
    return row ? mapSubscription(row) : null;
  }

  async findExpiredActiveForUser(userId: string) {
    const now = new Date();
    return prisma.subscription.findMany({
      where: {
        userId,
        status: 'ACTIVE',
        endsAt: { lte: now },
      },
      select: { id: true },
    });
  }

  async markExpired(ids: string[]) {
    if (ids.length === 0) return;
    await prisma.subscription.updateMany({
      where: { id: { in: ids } },
      data: { status: 'EXPIRED' },
    });
  }

  async listRecentForUser(userId: string, take = 10): Promise<SubscriptionWithPlan[]> {
    const rows = await prisma.subscription.findMany({
      where: { userId },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
      take,
    });
    return rows.map(mapSubscription);
  }

  async listForAdmin(status?: SubscriptionStatus) {
    const rows = await prisma.subscription.findMany({
      where: status ? { status } : undefined,
      include: {
        plan: true,
        user: { select: { id: true, email: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return rows.map((row) => ({
      ...mapSubscription(row),
      user: row.user,
    }));
  }

  async findDueForExpiryReminder(now: Date, until: Date) {
    return prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        expiryReminderSentAt: null,
        endsAt: { gt: now, lte: until },
      },
      include: {
        plan: true,
        user: { select: { email: true, name: true } },
      },
      take: 100,
    });
  }
}

export const subscriptionRepository = new SubscriptionRepository();
