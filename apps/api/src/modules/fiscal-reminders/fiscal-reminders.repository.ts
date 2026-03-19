import type { FiscalReminder } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

export type CreateFiscalReminderRepositoryInput = {
  title: string;
  description?: string | undefined;
  dueDate: Date;
  reminderDate: Date;
  severity: "LOW" | "MEDIUM" | "HIGH";
};

export type UpdateFiscalReminderRepositoryInput = {
  title?: string | undefined;
  description?: string | undefined;
  dueDate?: Date | undefined;
  reminderDate?: Date | undefined;
  severity?: "LOW" | "MEDIUM" | "HIGH" | undefined;
  resolvedAt?: Date | null | undefined;
};

export class FiscalRemindersRepository {
  async create(input: CreateFiscalReminderRepositoryInput) {
    return fiscalReminderDelegate().create({
      data: toCreateData(input)
    });
  }

  async findMany() {
    return fiscalReminderDelegate().findMany({
      orderBy: [{ resolvedAt: "asc" }, { dueDate: "asc" }, { createdAt: "asc" }]
    });
  }

  async findById(reminderId: string) {
    return fiscalReminderDelegate().findUnique({
      where: {
        id: reminderId
      }
    });
  }

  async update(reminderId: string, input: UpdateFiscalReminderRepositoryInput) {
    return fiscalReminderDelegate().update({
      where: {
        id: reminderId
      },
      data: toUpdateData(input)
    });
  }
}

type FiscalReminderDelegate = {
  create(args: { data: Record<string, unknown> }): Promise<FiscalReminder>;
  findMany(args: {
    orderBy: Array<Record<string, "asc" | "desc">>;
  }): Promise<FiscalReminder[]>;
  findUnique(args: { where: { id: string } }): Promise<FiscalReminder | null>;
  update(args: {
    where: { id: string };
    data: Record<string, unknown>;
  }): Promise<FiscalReminder>;
};

function fiscalReminderDelegate() {
  return (prisma as unknown as { fiscalReminder: FiscalReminderDelegate }).fiscalReminder;
}

function toCreateData(input: CreateFiscalReminderRepositoryInput) {
  const data: Record<string, unknown> = {
    title: input.title,
    dueDate: input.dueDate,
    reminderDate: input.reminderDate,
    severity: input.severity
  };

  if (input.description !== undefined) {
    data.description = input.description;
  }

  return data;
}

function toUpdateData(input: UpdateFiscalReminderRepositoryInput) {
  const data: Record<string, unknown> = {};

  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.dueDate !== undefined) data.dueDate = input.dueDate;
  if (input.reminderDate !== undefined) data.reminderDate = input.reminderDate;
  if (input.severity !== undefined) data.severity = input.severity;
  if (input.resolvedAt !== undefined) data.resolvedAt = input.resolvedAt;

  return data;
}
