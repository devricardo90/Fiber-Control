-- CreateEnum
CREATE TYPE "ReminderSeverity" AS ENUM ('low', 'medium', 'high');

-- CreateTable
CREATE TABLE "fiscal_reminders" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "due_date" DATE NOT NULL,
    "reminder_date" DATE NOT NULL,
    "severity" "ReminderSeverity" NOT NULL,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fiscal_reminders_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "fiscal_reminders_reminder_date_check" CHECK ("reminder_date" <= "due_date")
);

-- CreateIndex
CREATE INDEX "fiscal_reminders_due_date_idx" ON "fiscal_reminders"("due_date");

-- CreateIndex
CREATE INDEX "fiscal_reminders_reminder_date_idx" ON "fiscal_reminders"("reminder_date");

-- CreateIndex
CREATE INDEX "fiscal_reminders_severity_idx" ON "fiscal_reminders"("severity");
