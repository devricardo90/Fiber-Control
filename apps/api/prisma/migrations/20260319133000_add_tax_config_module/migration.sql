-- CreateTable
CREATE TABLE "tax_configs" (
    "id" TEXT NOT NULL,
    "singleton_key" TEXT NOT NULL DEFAULT 'default',
    "regime_label" TEXT NOT NULL,
    "estimated_rate" DECIMAL(5,2) NOT NULL,
    "due_day" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_configs_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "tax_configs_estimated_rate_check" CHECK ("estimated_rate" > 0 AND "estimated_rate" <= 100),
    CONSTRAINT "tax_configs_due_day_check" CHECK ("due_day" BETWEEN 1 AND 31)
);

-- CreateIndex
CREATE UNIQUE INDEX "tax_configs_singleton_key_key" ON "tax_configs"("singleton_key");

-- CreateIndex
CREATE INDEX "tax_configs_due_day_idx" ON "tax_configs"("due_day");
