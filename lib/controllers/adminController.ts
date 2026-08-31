import { z } from 'zod';
import { adminService } from '@/lib/services/adminService';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function loginAdmin(body: unknown) {
  const { email, password } = loginSchema.parse(body);
  const result = await adminService.login(email, password);
  return { success: true as const, data: result };
}

export async function getAdminMe(adminId: string) {
  const admin = await adminService.getAdmin(adminId);
  return { success: true as const, data: admin };
}
