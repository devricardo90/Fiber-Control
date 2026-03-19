-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'partial', 'failed');

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "reference_month" TEXT NOT NULL,
    "expected_amount" DECIMAL(10,2) NOT NULL,
    "received_amount" DECIMAL(10,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "paid_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "payments_reference_month_format_check" CHECK ("reference_month" ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
    CONSTRAINT "payments_expected_amount_positive_check" CHECK ("expected_amount" > 0),
    CONSTRAINT "payments_received_amount_non_negative_check" CHECK ("received_amount" >= 0)
);

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_reference_month_idx" ON "payments"("reference_month");

-- CreateIndex
CREATE INDEX "payments_customer_id_status_idx" ON "payments"("customer_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "payments_customer_id_reference_month_key" ON "payments"("customer_id", "reference_month");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
