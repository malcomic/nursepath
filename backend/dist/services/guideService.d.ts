export declare class GuideService {
    getAllGuides(): Promise<(import("../types").Guide & {
        category: any;
    })[]>;
    getGuide(id: string): Promise<import("../types").Guide & {
        category: any;
    }>;
    getGuidesByCategory(categoryId: string): Promise<(import("../types").Guide & {
        category: any;
    })[]>;
    createGuide(data: {
        title: string;
        description?: string;
        price: number;
        stripePriceId?: string;
        categoryId: string;
        pdfUrl: string;
        thumbnailUrl?: string;
    }): Promise<import("../types").Guide>;
    updateGuide(id: string, data: {
        title?: string;
        description?: string;
        price?: number;
        stripePriceId?: string;
        categoryId?: string;
        pdfUrl?: string;
        thumbnailUrl?: string;
    }): Promise<import("../types").Guide>;
    deleteGuide(id: string): Promise<import("../types").Guide>;
    searchGuides(query: string): Promise<(import("../types").Guide & {
        category: any;
    })[]>;
}
export declare const guideService: GuideService;
//# sourceMappingURL=guideService.d.ts.map