import { purchaseRepository } from '@/lib/repositories/purchaseRepository';
import { guideRepository } from '@/lib/repositories/guideRepository';
import { ApiError } from '@/lib/errors/api-error';

export class PurchaseService {
  async getAllPurchases() {
    return purchaseRepository.findAll();
  }

  async getPurchasesByGuide(guideId: string) {
    await guideRepository.findById(guideId);
    return purchaseRepository.findByGuideId(guideId);
  }

  async getPurchasesByEmail(email: string) {
    return purchaseRepository.findByEmail(email);
  }

  async createPurchase(guideId: string, buyerName: string, buyerEmail: string) {
    void guideId;
    void buyerName;
    void buyerEmail;
    throw new ApiError(
      410,
      'Direct purchases are disabled. Please use Stripe checkout to purchase guides.'
    );
  }
}

export const purchaseService = new PurchaseService();
