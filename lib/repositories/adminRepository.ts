import { prisma } from '@/lib/prisma';
import type { Admin } from '@/lib/types';

export class AdminRepository {
  async findByEmail(email: string): Promise<Admin | null> {
    return prisma.admin.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<Admin | null> {
    return prisma.admin.findUnique({ where: { id } });
  }

  async create(email: string, passwordHash: string): Promise<Admin> {
    return prisma.admin.create({ data: { email, passwordHash } });
  }

  async updatePassword(id: string, passwordHash: string): Promise<Admin> {
    return prisma.admin.update({ where: { id }, data: { passwordHash } });
  }
}

export const adminRepository = new AdminRepository();
