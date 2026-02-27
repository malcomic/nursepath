import { Category } from '../types';
export declare class CategoryRepository {
    findAll(): Promise<Category[]>;
    findById(id: string): Promise<Category | null>;
    create(name: string, description?: string, icon?: string): Promise<Category>;
    update(id: string, data: Partial<Category>): Promise<Category>;
    delete(id: string): Promise<Category>;
}
export declare const categoryRepository: CategoryRepository;
//# sourceMappingURL=categoryRepository.d.ts.map