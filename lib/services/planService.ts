import { planRepository } from '@/lib/repositories/planRepository';
import { ApiError } from '@/lib/errors/api-error';

export class PlanService {
  async listActive() {
    return planRepository.findActive();
  }

  async getByCode(code: string) {
    const plan = await planRepository.findByCode(code);
    if (!plan || !plan.isActive) {
      throw new ApiError(404, 'Plan not found');
    }
    return plan;
  }

  async getById(id: string) {
    const plan = await planRepository.findById(id);
    if (!plan) {
      throw new ApiError(404, 'Plan not found');
    }
    return plan;
  }

  async listAll() {
    return planRepository.findAll();
  }

  async updatePlan(
    id: string,
    data: {
      priceUsd?: number;
      isActive?: boolean;
      description?: string | null;
    }
  ) {
    await this.getById(id);
    if (data.priceUsd !== undefined && (data.priceUsd < 0 || Number.isNaN(data.priceUsd))) {
      throw new ApiError(400, 'Invalid price');
    }
    return planRepository.update(id, data);
  }
}

export const planService = new PlanService();
