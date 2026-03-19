-- CreateEnum
CREATE TYPE "BankEntryStatus" AS ENUM ('unmatched', 'matched');

-- CreateTable
CREATE TABLE "bank_entries" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "reference_code" TEXT,
    "source" TEXT,
    "status" "BankEntryStatus" NOT NULL DEFAULT 'unmatched',
    "payment_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_entries_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "bank_entries_amount_check" CHECK ("amount" > 0)
);

-- CreateIndex
CREATE INDEX "bank_entries_status_idx" ON "bank_entries"("status");

-- CreateIndex
CREATE INDEX "bank_entries_occurred_at_idx" ON "bank_entries"("occurred_at");

-- CreateIndex
CREATE INDEX "bank_entries_payment_id_idx" ON "bank_entries"("payment_id");

-- AddForeignKey
ALTER TABLE "bank_entries" ADD CONSTRAINT "bank_entries_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
