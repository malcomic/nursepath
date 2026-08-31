import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';

export const GET = withHandler(async () => {
  return jsonResponse({ success: true, message: 'Backend is running!' });
});
