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
    // Verify guide exists
    const guide = await guideRepository.findById(guideId);
    if (!guide) {
      throw new ApiError(404, 'Guide not found');
    }

    // Create purchase
    const purchase = await purchaseRepository.create(guideId, buyerName, buyerEmail);

    return {
      purchase,
      downloadUrl: guide.pdfUrl,
    };
  }
}

export const purchaseService = new PurchaseService();
