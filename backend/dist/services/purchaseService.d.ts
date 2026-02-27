export declare class PurchaseService {
    getAllPurchases(): Promise<(import("../types").Purchase & {
        guide: any;
    })[]>;
    getPurchasesByGuide(guideId: string): Promise<import("../types").Purchase[]>;
    getPurchasesByEmail(email: string): Promise<(import("../types").Purchase & {
        guide: any;
    })[]>;
    createPurchase(guideId: string, buyerName: string, buyerEmail: string): Promise<{
        purchase: import("../types").Purchase;
        downloadUrl: string;
    }>;
}
export declare const purchaseService: PurchaseService;
//# sourceMappingURL=purchaseService.d.ts.map