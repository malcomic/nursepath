import { z } from 'zod';
import { emailService } from '@/lib/services/emailService';
import { ApiError } from '@/lib/errors/api-error';

const contactSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: z.string().trim().email(),
  subject: z.string().trim().min(1).max(255),
  message: z.string().trim().min(1).max(5000),
  website: z.string().optional(),
});

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    throw new ApiError(429, 'Too many requests. Please try again later.');
  }

  entry.count += 1;
}

export async function submitContactForm(body: unknown, ipAddress?: string) {
  if (ipAddress) {
    checkRateLimit(ipAddress);
  }

  const input = contactSchema.parse(body);

  if (input.website) {
    return { success: true as const };
  }

  await emailService.sendContactEmail({
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
  });

  return { success: true as const };
}
