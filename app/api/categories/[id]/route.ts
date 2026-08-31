import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '@/lib/controllers/categoryController';

export const GET = withHandler(async (_req, { params }) => {
  const { id } = await params;
  return jsonResponse(await getCategoryById(id));
});

export const PUT = withHandler(async (req, { params }) => {
  verifyAdmin(req);
  const { id } = await params;
  const body = await req.json();
  return jsonResponse(await updateCategory(id, body));
});

export const DELETE = withHandler(async (req, { params }) => {
  verifyAdmin(req);
  const { id } = await params;
  return jsonResponse(await deleteCategory(id));
});
