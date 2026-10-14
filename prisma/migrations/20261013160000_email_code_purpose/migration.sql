-- Invalidate old plaintext verification codes, without touching user records.
DELETE FROM "EmailCode";
ALTER TABLE "EmailCode" ADD COLUMN "purpose" TEXT NOT NULL DEFAULT 'registration';
CREATE UNIQUE INDEX "EmailCode_email_purpose_key" ON "EmailCode"("email", "purpose");
CREATE INDEX "EmailCode_expiresAt_idx" ON "EmailCode"("expiresAt");
