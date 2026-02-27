import { Guide } from '../types';
export declare class GuideRepository {
    findAll(): Promise<(Guide & {
        category: any;
    })[]>;
    findById(id: string): Promise<(Guide & {
        category: any;
    }) | null>;
    findByCategory(categoryId: string): Promise<(Guide & {
        category: any;
    })[]>;
    create(data: Omit<Guide, 'id' | 'createdAt' | 'updatedAt'>): Promise<Guide>;
    update(id: string, data: Partial<Guide>): Promise<Guide>;
    delete(id: string): Promise<Guide>;
    search(query: string): Promise<(Guide & {
        category: any;
    })[]>;
}
export declare const guideRepository: GuideRepository;
//# sourceMappingURL=guideRepository.d.ts.map