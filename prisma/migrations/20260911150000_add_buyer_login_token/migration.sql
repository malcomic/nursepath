-- CreateTable
CREATE TABLE "BuyerLoginToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BuyerLoginToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BuyerLoginToken_tokenHash_key" ON "BuyerLoginToken"("tokenHash");
CREATE INDEX "BuyerLoginToken_email_idx" ON "BuyerLoginToken"("email");
CREATE INDEX "BuyerLoginToken_expiresAt_idx" ON "BuyerLoginToken"("expiresAt");
