import { z } from 'zod';
import bcrypt from 'bcrypt';
import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';
import { ApiError } from '@/lib/errors/api-error';

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('A valid email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
});

export const POST = withHandler(async (req) => {
  const body = registerSchema.parse(await req.json());
  const email = body.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(body.password, 12);
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email,
      passwordHash,
    },
    select: { id: true, email: true, name: true },
  });

  return jsonResponse({ success: true as const, data: user }, 201);
});
