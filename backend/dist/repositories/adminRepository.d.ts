import { Admin } from '../types';
export declare class AdminRepository {
    findByEmail(email: string): Promise<Admin | null>;
    findById(id: string): Promise<Admin | null>;
    create(email: string, passwordHash: string): Promise<Admin>;
    updatePassword(id: string, passwordHash: string): Promise<Admin>;
}
export declare const adminRepository: AdminRepository;
//# sourceMappingURL=adminRepository.d.ts.map