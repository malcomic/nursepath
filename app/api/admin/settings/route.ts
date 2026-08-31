import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { getSettings, updateSettings } from '@/lib/controllers/settingsController';

export const GET = withHandler(async (req) => {
  verifyAdmin(req);
  return jsonResponse(await getSettings());
});

export const PUT = withHandler(async (req) => {
  verifyAdmin(req);
  const body = await req.json();
  return jsonResponse(await updateSettings(body));
});
