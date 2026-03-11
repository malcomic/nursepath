import { purchaseRepository } from '../repositories/purchaseRepository';
import { guideRepository } from '../repositories/guideRepository';
import { ApiError } from '../middleware/errorHandler';

export class PurchaseService {
  async getAllPurchases() {
    return purchaseRepository.findAll();
  }

  async getPurchasesByGuide(guideId: string) {
    await guideRepository.findById(guideId); // Verify guide exists
    return purchaseRepository.findByGuideId(guideId);
  }

  async getPurchasesByEmail(email: string) {
    return purchaseRepository.findByEmail(email);
  }

  async createPurchase(guideId: string, buyerName: string, buyerEmail: string) {
    throw new ApiError(
      410,
      'Direct purchases are disabled. Please use Stripe checkout to purchase guides.'
    );
  }
}

export const purchaseService = new PurchaseService();
