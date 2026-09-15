import { contentDocumentRepository } from '@/lib/repositories/contentDocumentRepository';
import { subscriptionDownloadRepository } from '@/lib/repositories/subscriptionDownloadRepository';
import {
  getInForceSubscription,
  getLibraryAccess,
} from '@/lib/subscriptions/access';
import { MAX_LIBRARY_DOWNLOADS } from '@/lib/subscriptions/constants';
import { ApiError } from '@/lib/errors/api-error';
import type { ContentType } from '@/lib/types';
import { toPublicContentDocument } from '@/lib/controllers/contentDocumentController';

export type LibraryDocumentItem = ReturnType<typeof toPublicContentDocument> & {
  alreadyDownloaded: boolean;
};

export class LibraryService {
  async listDocuments(userId: string, filters?: { type?: ContentType }) {
    const access = await getLibraryAccess(userId);
    if (!access.hasAccess) {
      throw new ApiError(403, 'An active library pass is required.');
    }

    const inForce = await getInForceSubscription(userId);
    const downloadedIds = inForce
      ? await subscriptionDownloadRepository.listContentIds(inForce.id)
      : [];
    const downloadedSet = new Set(downloadedIds);
    const downloadsUsed = downloadedIds.length;
    const downloadsRemaining = Math.max(0, MAX_LIBRARY_DOWNLOADS - downloadsUsed);

    const docs = await contentDocumentRepository.findAll({
      type: filters?.type,
    });

    const documents: LibraryDocumentItem[] = docs.map((doc) => ({
      ...toPublicContentDocument(doc),
      alreadyDownloaded: downloadedSet.has(doc.id),
    }));

    return {
      documents,
      downloadsUsed,
      downloadsRemaining,
      downloadsMax: MAX_LIBRARY_DOWNLOADS,
      endsAt: access.endsAt,
      planName: access.planName,
      inForceSubscriptionId: inForce?.id ?? null,
    };
  }

  async requireInForceAccess(userId: string) {
    const inForce = await getInForceSubscription(userId);
    if (!inForce) {
      throw new ApiError(403, 'An active library pass is required.');
    }
    return inForce;
  }

  async getDocumentForUser(userId: string, documentId: string) {
    await this.requireInForceAccess(userId);
    const doc = await contentDocumentRepository.findById(documentId);
    if (!doc) {
      throw new ApiError(404, 'Document not found');
    }
    return doc;
  }

  async authorizeDownload(userId: string, documentId: string) {
    const inForce = await this.requireInForceAccess(userId);
    const doc = await contentDocumentRepository.findById(documentId);
    if (!doc) {
      throw new ApiError(404, 'Document not found');
    }

    const existing = await subscriptionDownloadRepository.findOne(inForce.id, documentId);
    if (existing) {
      return { doc, alreadyDownloaded: true as const, subscriptionId: inForce.id };
    }

    const used = await subscriptionDownloadRepository.countForSubscription(inForce.id);
    if (used >= MAX_LIBRARY_DOWNLOADS) {
      throw new ApiError(
        403,
        'Download limit reached. You can still view online, or renew for another pass.'
      );
    }

    await subscriptionDownloadRepository.create(inForce.id, documentId);
    return { doc, alreadyDownloaded: false as const, subscriptionId: inForce.id };
  }
}

export const libraryService = new LibraryService();
