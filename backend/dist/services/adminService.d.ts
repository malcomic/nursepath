export declare class AdminService {
    login(email: string, password: string): Promise<{
        token: string;
        admin: {
            id: string;
            email: string;
        };
    }>;
    getAdmin(id: string): Promise<{
        id: string;
        email: string;
    }>;
}
export declare const adminService: AdminService;
//# sourceMappingURL=adminService.d.ts.map