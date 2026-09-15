import { prisma } from '@/lib/prisma';

export type PlanRecord = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  durationDays: number;
  priceUsd: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

function mapPlan(plan: {
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
}): PlanRecord {
  return {
    ...plan,
    priceUsd: Number(plan.priceUsd),
  };
}

export class PlanRepository {
  async findActive(): Promise<PlanRecord[]> {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    return plans.map(mapPlan);
  }

  async findByCode(code: string): Promise<PlanRecord | null> {
    const plan = await prisma.plan.findUnique({ where: { code } });
    return plan ? mapPlan(plan) : null;
  }

  async findById(id: string): Promise<PlanRecord | null> {
    const plan = await prisma.plan.findUnique({ where: { id } });
    return plan ? mapPlan(plan) : null;
  }

  async findAll(): Promise<PlanRecord[]> {
    const plans = await prisma.plan.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return plans.map(mapPlan);
  }

  async update(
    id: string,
    data: {
      priceUsd?: number;
      isActive?: boolean;
      description?: string | null;
    }
  ): Promise<PlanRecord> {
    const plan = await prisma.plan.update({
      where: { id },
      data: {
        ...(data.priceUsd !== undefined ? { priceUsd: data.priceUsd } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
      },
    });
    return mapPlan(plan);
  }
}

export const planRepository = new PlanRepository();
