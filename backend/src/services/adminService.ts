import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { adminRepository } from '../repositories/adminRepository';
import { config } from '../config/env';
import { ApiError } from '../middleware/errorHandler';

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
      config.jwtSecret,
      { expiresIn: config.jwtExpiry as any }
    );

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    };
  }

  async getAdmin(id: string) {
    const admin = await adminRepository.findById(id);
    if (!admin) {
      throw new ApiError(404, 'Admin not found');
    }

    return {
      id: admin.id,
      email: admin.email,
    };
  }
}

export const adminService = new AdminService();
