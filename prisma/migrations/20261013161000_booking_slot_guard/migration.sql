-- Partial unique indexes are not representable in this Prisma version.
-- This is the concurrency guard: cancelled reservations release the slot.
-- Existing active duplicates MUST be reconciled before deployment (no destructive cleanup).
CREATE UNIQUE INDEX "Booking_active_slot_key" ON "Booking"("date", "time") WHERE "status" != 'cancelled';
CREATE INDEX "Booking_date_status_idx" ON "Booking"("date", "status");
