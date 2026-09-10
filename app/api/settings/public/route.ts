import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { getPublicSettings } from '@/lib/controllers/settingsController';

export const GET = withHandler(async () => {
  return jsonResponse(await getPublicSettings());
});
