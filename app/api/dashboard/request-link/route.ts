import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';

/** @deprecated Magic-link sign-in is retired. Use /login. */
export const POST = withHandler(async () => {
  return jsonResponse(
    {
      success: false as const,
      error: 'Magic-link sign-in is no longer available. Please sign in at /login.',
    },
    410
  );
});
