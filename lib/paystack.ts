import crypto from 'crypto';
import { config } from '@/lib/config/env';
import { ApiError } from '@/lib/errors/api-error';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export type PaystackChannel = 'card' | 'mobile_money';

export interface PaystackInitializeParams {
  email: string;
  amount: number;
  currency: 'USD' | 'KES';
  reference: string;
  callback_url: string;
  channels: PaystackChannel[];
  metadata?: Record<string, unknown>;
}

export interface PaystackInitializeData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface PaystackVerifyData {
  status: string;
  reference: string;
  amount: number;
  currency: string;
  metadata?: Record<string, unknown>;
}

interface PaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export function verifyPaystackSignature(rawBody: string, signature: string | null): boolean {
  if (!signature || !config.paystackWebhookSecret) {
    return false;
  }
  const hash = crypto
    .createHmac('sha512', config.paystackWebhookSecret)
    .update(rawBody)
    .digest('hex');
  return hash === signature;
}

export async function paystackRequest<T>(
  path: string,
  options: { method?: 'GET' | 'POST'; body?: unknown } = {}
): Promise<T> {
  const method = options.method ?? (options.body ? 'POST' : 'GET');
  const res = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${config.paystackSecretKey}`,
      'Content-Type': 'application/json',
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const json = (await res.json()) as PaystackResponse<T>;
  if (!res.ok || !json.status) {
    throw new ApiError(res.status >= 400 ? res.status : 502, json.message || 'Paystack request failed');
  }
  return json.data;
}

export async function initializeTransaction(
  params: PaystackInitializeParams
): Promise<PaystackInitializeData> {
  return paystackRequest<PaystackInitializeData>('/transaction/initialize', {
    method: 'POST',
    body: params,
  });
}

export async function verifyTransaction(reference: string): Promise<PaystackVerifyData> {
  return paystackRequest<PaystackVerifyData>(
    `/transaction/verify/${encodeURIComponent(reference)}`
  );
}
