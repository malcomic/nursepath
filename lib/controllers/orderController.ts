import { orderService } from '@/lib/services/orderService';
import { getBaseUrl } from '@/lib/api/get-base-url';
import { NextRequest } from 'next/server';

export async function listOrders(
  request: NextRequest,
  query: {
    page?: string | null;
    search?: string | null;
    status?: string | null;
    dateFrom?: string | null;
    dateTo?: string | null;
    sort?: string | null;
  }
) {
  const result = await orderService.listOrders({
    page: query.page ? Number(query.page) : undefined,
    search: query.search ?? undefined,
    status: query.status ?? undefined,
    dateFrom: query.dateFrom ?? undefined,
    dateTo: query.dateTo ?? undefined,
    sort: query.sort ?? undefined,
  });
  return { success: true as const, data: result };
}

export async function getOrderById(id: string) {
  const order = await orderService.getOrderById(id);
  return { success: true as const, data: order };
}

export async function refundOrder(id: string) {
  const updated = await orderService.markAsRefunded(id);
  return { success: true as const, data: updated };
}

export async function resendOrderLink(request: NextRequest, id: string) {
  const baseUrl = getBaseUrl(request);
  const result = await orderService.resendDownloadLink(id, baseUrl);
  return { success: true as const, data: result };
}

export async function regenerateOrderLink(
  request: NextRequest,
  id: string,
  body: { maxDownloads?: number; expiryHours?: number }
) {
  const baseUrl = getBaseUrl(request);
  const result = await orderService.regenerateDownloadLink(id, baseUrl, body);
  return { success: true as const, data: result };
}

export async function deleteOrder(id: string) {
  await orderService.deleteOrder(id);
  return { success: true as const };
}
