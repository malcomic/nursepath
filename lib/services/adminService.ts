import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { adminRepository } from '@/lib/repositories/adminRepository';
import { config } from '@/lib/config/env';
import { ApiError } from '@/lib/errors/api-error';

export class AdminService {
  async login(email: string, password: string) {
    const admin = await adminRepository.findByEmail(email);
    if (!admin) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      config.jwtSecret!,
      { expiresIn: config.jwtExpiry as jwt.SignOptions['expiresIn'] }
    );

    return {
      token,
      admin: { id: admin.id, email: admin.email },
    };
  }

  async getAdmin(id: string) {
    const admin = await adminRepository.findById(id);
    if (!admin) {
      throw new ApiError(404, 'Admin not found');
    }
    return { id: admin.id, email: admin.email };
  }
}

export const adminService = new AdminService();
