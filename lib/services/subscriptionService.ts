import { subscriptionRepository } from '@/lib/repositories/subscriptionRepository';
import { planService } from '@/lib/services/planService';
import { ApiError } from '@/lib/errors/api-error';
import {
  computeStackedWindow,
  getLibraryAccess,
  lazyExpireSubscriptions,
} from '@/lib/subscriptions/access';
import { SubscriptionStatus } from '@/lib/generated/prisma/enums';
import { emailService } from '@/lib/services/emailService';
import { config } from '@/lib/config/env';
import { prisma } from '@/lib/prisma';

export class SubscriptionService {
  async createPending(params: {
    userId: string;
    planCode: string;
    paymentProvider?: string;
  }) {
    const plan = await planService.getByCode(params.planCode);
    return subscriptionRepository.create({
      userId: params.userId,
      planId: plan.id,
      status: SubscriptionStatus.PENDING,
      amountUsd: plan.priceUsd,
      paymentProvider: params.paymentProvider ?? 'paystack',
    });
  }

  async getByIdForUser(id: string, userId: string) {
    const sub = await subscriptionRepository.findById(id);
    if (!sub || sub.userId !== userId) {
      throw new ApiError(404, 'Subscription not found');
    }
    return sub;
  }

  async getAccessSummary(userId: string) {
    await lazyExpireSubscriptions(userId);
    const access = await getLibraryAccess(userId);
    const recent = await subscriptionRepository.listRecentForUser(userId, 5);
    return { access, recent };
  }

  /**
   * Activate a pending subscription after successful Paystack payment.
   * Stacks: startsAt = max(now, latestActiveEndsAt), endsAt = startsAt + durationDays.
   */
  async activateFromPayment(reference: string) {
    const existing = await subscriptionRepository.findByPaymentReference(reference);
    if (!existing) {
      throw new ApiError(404, 'Subscription not found for payment reference');
    }

    if (existing.status === SubscriptionStatus.ACTIVE) {
      return existing;
    }

    if (existing.status !== SubscriptionStatus.PENDING) {
      throw new ApiError(400, 'Subscription cannot be activated');
    }

    await lazyExpireSubscriptions(existing.userId);
    const latestEnds = await subscriptionRepository.findLatestActiveEndsAt(existing.userId);
    const { startsAt, endsAt } = computeStackedWindow(
      existing.plan.durationDays,
      latestEnds
    );

    const activated = await subscriptionRepository.update(existing.id, {
      status: SubscriptionStatus.ACTIVE,
      startsAt,
      endsAt,
      paymentProvider: 'paystack',
    });

    const user = await prisma.user.findUnique({
      where: { id: existing.userId },
      select: { email: true, name: true },
    });
    if (user?.email && activated.endsAt) {
      const baseUrl = config.publicAppUrl || 'http://localhost:3000';
      void emailService
        .sendLibraryPassActivatedEmail({
          to: user.email,
          name: user.name,
          planName: activated.plan.name,
          endsAt: activated.endsAt,
          libraryUrl: `${baseUrl}/dashboard/library`,
        })
        .catch((err) => {
          console.error('Failed to send library activated email:', err);
        });
    }

    return activated;
  }

  async setPaymentReference(id: string, reference: string) {
    return subscriptionRepository.update(id, { paymentReference: reference });
  }

  async listForAdmin(status?: SubscriptionStatus) {
    return subscriptionRepository.listForAdmin(status);
  }

  async sendExpiryReminders() {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const due = await subscriptionRepository.findDueForExpiryReminder(now, in24h);
    const baseUrl = config.publicAppUrl || 'http://localhost:3000';
    let sent = 0;

    for (const sub of due) {
      if (!sub.user.email || !sub.endsAt) continue;
      try {
        await emailService.sendLibraryPassExpiringEmail({
          to: sub.user.email,
          name: sub.user.name,
          planName: sub.plan.name,
          endsAt: sub.endsAt,
          pricingUrl: `${baseUrl}/pricing`,
        });
        await subscriptionRepository.update(sub.id, {
          expiryReminderSentAt: new Date(),
        });
        sent += 1;
      } catch (err) {
        console.error(`Failed expiry reminder for subscription ${sub.id}:`, err);
      }
    }

    return { checked: due.length, sent };
  }
}

export const subscriptionService = new SubscriptionService();
