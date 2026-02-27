export declare class CategoryService {
    getAllCategories(): Promise<import("../types").Category[]>;
    getCategory(id: string): Promise<import("../types").Category>;
    createCategory(name: string, description?: string, icon?: string): Promise<import("../types").Category>;
    updateCategory(id: string, name: string, description?: string, icon?: string): Promise<import("../types").Category>;
    deleteCategory(id: string): Promise<import("../types").Category>;
}
export declare const categoryService: CategoryService;
//# sourceMappingURL=categoryService.d.ts.map