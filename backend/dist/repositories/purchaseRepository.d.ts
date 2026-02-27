import { Purchase } from '../types';
export declare class PurchaseRepository {
    findAll(): Promise<(Purchase & {
        guide: any;
    })[]>;
    findByGuideId(guideId: string): Promise<Purchase[]>;
    findByEmail(email: string): Promise<(Purchase & {
        guide: any;
    })[]>;
    create(guideId: string, buyerName: string, buyerEmail: string): Promise<Purchase>;
}
export declare const purchaseRepository: PurchaseRepository;
//# sourceMappingURL=purchaseRepository.d.ts.map