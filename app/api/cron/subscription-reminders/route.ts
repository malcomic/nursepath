import { NextResponse } from 'next/server';
import { subscriptionService } from '@/lib/services/subscriptionService';

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await subscriptionService.sendExpiryReminders();
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error('subscription-reminders cron failed:', err);
    return NextResponse.json({ success: false, error: 'Cron failed' }, { status: 500 });
  }
}
