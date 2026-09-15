import { subscriptionRepository } from '@/lib/repositories/subscriptionRepository';
import type { SubscriptionWithPlan } from '@/lib/repositories/subscriptionRepository';

export type LibraryAccess = {
  hasAccess: boolean;
  endsAt: Date | null;
  planName: string | null;
  planCode: string | null;
};

/** Mark ACTIVE subscriptions past endsAt as EXPIRED for this user. */
export async function lazyExpireSubscriptions(userId: string): Promise<void> {
  const expired = await subscriptionRepository.findExpiredActiveForUser(userId);
  await subscriptionRepository.markExpired(expired.map((s) => s.id));
}

/**
 * Currently running pass: ACTIVE with startsAt <= now < endsAt.
 * If several, prefer latest startsAt (current window for download quota).
 */
export async function getInForceSubscription(
  userId: string
): Promise<SubscriptionWithPlan | null> {
  await lazyExpireSubscriptions(userId);
  return subscriptionRepository.findInForceForUser(userId);
}

/**
 * hasAccess only while an in-force pass is running.
 * endsAt is the farthest active end (includes stacked future time).
 */
export async function getLibraryAccess(userId: string): Promise<LibraryAccess> {
  await lazyExpireSubscriptions(userId);
  const inForce = await subscriptionRepository.findInForceForUser(userId);
  const active = await subscriptionRepository.findActiveForUser(userId);

  if (!inForce) {
    return { hasAccess: false, endsAt: null, planName: null, planCode: null };
  }

  const farthest = active[0];
  return {
    hasAccess: true,
    endsAt: farthest?.endsAt ?? inForce.endsAt,
    planName: inForce.plan.name,
    planCode: inForce.plan.code,
  };
}

/** Stacked window: starts at max(now, latestActiveEndsAt), ends start + durationDays. */
export function computeStackedWindow(
  durationDays: number,
  latestActiveEndsAt: Date | null,
  now = new Date()
): { startsAt: Date; endsAt: Date } {
  const startsAt =
    latestActiveEndsAt && latestActiveEndsAt.getTime() > now.getTime()
      ? latestActiveEndsAt
      : now;
  const endsAt = new Date(startsAt.getTime() + durationDays * 24 * 60 * 60 * 1000);
  return { startsAt, endsAt };
}
