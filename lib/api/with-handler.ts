import { NextRequest, NextResponse } from 'next/server';
import { errorResponse } from '@/lib/api/response';

export type RouteContext = {
  params: Promise<Record<string, string>>;
};

export function withHandler(
  fn: (req: NextRequest, ctx: RouteContext) => Promise<NextResponse>
) {
  return async (req: NextRequest, ctx: RouteContext) => {
    try {
      return await fn(req, ctx);
    } catch (err) {
      return errorResponse(err);
    }
  };
}
