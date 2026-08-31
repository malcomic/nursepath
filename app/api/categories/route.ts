import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import {
  getAllCategories,
  createCategory,
} from '@/lib/controllers/categoryController';

export const GET = withHandler(async () => {
  return jsonResponse(await getAllCategories());
});

export const POST = withHandler(async (req) => {
  verifyAdmin(req);
  const body = await req.json();
  const result = await createCategory(body);
  return jsonResponse(result, 201);
});
