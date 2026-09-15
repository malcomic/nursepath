-- CreateTable
CREATE TABLE "SubscriptionDownload" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "contentDocumentId" TEXT NOT NULL,
    "downloadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionDownload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubscriptionDownload_subscriptionId_idx" ON "SubscriptionDownload"("subscriptionId");

-- CreateIndex
CREATE INDEX "SubscriptionDownload_contentDocumentId_idx" ON "SubscriptionDownload"("contentDocumentId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionDownload_subscriptionId_contentDocumentId_key" ON "SubscriptionDownload"("subscriptionId", "contentDocumentId");

-- AddForeignKey
ALTER TABLE "SubscriptionDownload" ADD CONSTRAINT "SubscriptionDownload_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionDownload" ADD CONSTRAINT "SubscriptionDownload_contentDocumentId_fkey" FOREIGN KEY ("contentDocumentId") REFERENCES "ContentDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
