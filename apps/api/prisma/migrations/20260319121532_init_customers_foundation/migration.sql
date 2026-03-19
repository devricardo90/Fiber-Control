-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('active', 'due_today', 'overdue', 'suspended', 'inactive');

-- CreateTable
CREATE TABLE "regions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "document_id" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address_line" TEXT,
    "address_number" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postal_code" TEXT,
    "notes" TEXT,
    "status" "CustomerStatus" NOT NULL DEFAULT 'active',
    "monthly_fee" DECIMAL(10,2) NOT NULL,
    "due_day" INTEGER NOT NULL,
    "grace_days" INTEGER NOT NULL DEFAULT 0,
    "cutoff_days" INTEGER NOT NULL DEFAULT 0,
    "service_start_date" DATE,
    "region_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "customers_monthly_fee_positive_check" CHECK ("monthly_fee" > 0),
    CONSTRAINT "customers_due_day_range_check" CHECK ("due_day" BETWEEN 1 AND 31),
    CONSTRAINT "customers_grace_days_non_negative_check" CHECK ("grace_days" >= 0),
    CONSTRAINT "customers_cutoff_days_non_negative_check" CHECK ("cutoff_days" >= 0)
);

-- CreateIndex
CREATE UNIQUE INDEX "regions_code_key" ON "regions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "regions_name_key" ON "regions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "customers_document_id_key" ON "customers"("document_id");

-- CreateIndex
CREATE INDEX "customers_status_idx" ON "customers"("status");

-- CreateIndex
CREATE INDEX "customers_due_day_idx" ON "customers"("due_day");

-- CreateIndex
CREATE INDEX "customers_region_id_status_idx" ON "customers"("region_id", "status");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
