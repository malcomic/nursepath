import { NextRequest } from 'next/server';
import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import {
  getAllGuides,
  getAllGuidesPublic,
  createGuide,
} from '@/lib/controllers/guideController';

function isAdminRequest(req: NextRequest): boolean {
  try {
    verifyAdmin(req);
    return true;
  } catch {
    return false;
  }
}

export const GET = withHandler(async (req) => {
  if (isAdminRequest(req)) {
    return jsonResponse(await getAllGuides());
  }
  return jsonResponse(await getAllGuidesPublic());
});

export const POST = withHandler(async (req) => {
  verifyAdmin(req);
  const body = await req.json();
  const result = await createGuide(body);
  return jsonResponse(result, 201);
});
