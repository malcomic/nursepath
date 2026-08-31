import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ApiError } from '@/lib/errors/api-error';

export function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

export function errorResponse(err: unknown) {
  if (err instanceof ApiError) {
    return NextResponse.json(
      { success: false, error: err.message, errors: err.errors },
      { status: err.statusCode }
    );
  }

  if (err instanceof ZodError) {
    return NextResponse.json(
      { success: false, error: 'Validation error', errors: err.issues },
      { status: 400 }
    );
  }

  console.error(err);
  return NextResponse.json(
    { success: false, error: 'Internal server error' },
    { status: 500 }
  );
}
