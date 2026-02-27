import { Response } from 'express';
import { AdminRequest } from '../types/express';
import { asyncHandler, ApiError } from '../middleware/errorHandler';
import { orderService } from '../services/orderService';

export class OrderController {
  getAll = asyncHandler(async (req: AdminRequest, res: Response) => {
    if (!req.admin) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { page, search, status, dateFrom, dateTo, sort } = req.query;

    const result = await orderService.listOrders({
      page: page ? Number(page) : undefined,
      search: search as string | undefined,
      status: status as string | undefined,
      dateFrom: dateFrom as string | undefined,
      dateTo: dateTo as string | undefined,
      sort: sort as string | undefined,
    });

    res.json({
      success: true,
      data: result,
    });
  });

  getById = asyncHandler(async (req: AdminRequest, res: Response) => {
    if (!req.admin) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { id } = req.params;
    const order = await orderService.getOrderById(id);

    res.json({
      success: true,
      data: order,
    });
  });

  refund = asyncHandler(async (req: AdminRequest, res: Response) => {
    if (!req.admin) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { id } = req.params;
    const updated = await orderService.markAsRefunded(id);

    res.json({
      success: true,
      data: updated,
    });
  });

  resendLink = asyncHandler(async (req: AdminRequest, res: Response) => {
    if (!req.admin) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { id } = req.params;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result = await orderService.resendDownloadLink(id, baseUrl);

    res.json({
      success: true,
      data: result,
    });
  });

  regenerateLink = asyncHandler(async (req: AdminRequest, res: Response) => {
    if (!req.admin) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { id } = req.params;
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const { maxDownloads, expiryHours } = req.body || {};

    const result = await orderService.regenerateDownloadLink(id, baseUrl, {
      maxDownloads,
      expiryHours,
    });

    res.json({
      success: true,
      data: result,
    });
  });

  delete = asyncHandler(async (req: AdminRequest, res: Response) => {
    if (!req.admin) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { id } = req.params;
    await orderService.deleteOrder(id);

    res.json({
      success: true,
    });
  });
}

export const orderController = new OrderController();

