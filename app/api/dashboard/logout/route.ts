import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';

/** @deprecated Use Auth.js signOut. Magic-link buyer sessions are retired. */
export const POST = withHandler(async () => {
  return jsonResponse(
    {
      success: false as const,
      error: 'Use the account Sign out button. Magic-link sessions are no longer supported.',
    },
    410
  );
});
