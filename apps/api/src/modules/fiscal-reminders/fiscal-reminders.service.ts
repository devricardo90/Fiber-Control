import { AppError } from "../../lib/app-error.js";
import type {
  FiscalRemindersRepository
} from "./fiscal-reminders.repository.js";

type FiscalReminderRecord = Awaited<ReturnType<FiscalRemindersRepository["create"]>>;

type CreateFiscalReminderInput = {
  title: string;
  description?: string;
  dueDate: string;
  reminderDate: string;
  severity: "low" | "medium" | "high";
};

type UpdateFiscalReminderInput = {
  title?: string;
  description?: string;
  dueDate?: string;
  reminderDate?: string;
  severity?: "low" | "medium" | "high";
  resolved?: boolean;
};

export class FiscalRemindersService {
  constructor(private readonly fiscalRemindersRepository: FiscalRemindersRepository) {}

  async createReminder(input: CreateFiscalReminderInput) {
    const dueDate = parseDateInput(input.dueDate, "INVALID_DUE_DATE", "Due date must use YYYY-MM-DD");
    const reminderDate = parseDateInput(
      input.reminderDate,
      "INVALID_REMINDER_DATE",
      "Reminder date must use YYYY-MM-DD"
    );

    validateReminderWindow(reminderDate, dueDate);

    const reminder = await this.fiscalRemindersRepository.create({
      title: input.title,
      description: input.description,
      dueDate,
      reminderDate,
      severity: mapSeverityToEnum(input.severity)
    });

    return mapReminder(reminder);
  }

  async listReminders(referenceDate?: string) {
    const anchorDate = parseOptionalReferenceDate(referenceDate);
    const reminders = await this.fiscalRemindersRepository.findMany();

    return reminders.map((reminder: FiscalReminderRecord) => mapReminder(reminder, anchorDate));
  }

  async updateReminder(reminderId: string, input: UpdateFiscalReminderInput) {
    if (Object.keys(input).length === 0) {
      throw new AppError(400, "EMPTY_UPDATE_PAYLOAD", "Update payload cannot be empty");
    }

    const existingReminder = await this.fiscalRemindersRepository.findById(reminderId);

    if (!existingReminder) {
      throw new AppError(404, "FISCAL_REMINDER_NOT_FOUND", "Fiscal reminder was not found");
    }

    const effectiveDueDate = input.dueDate
      ? parseDateInput(input.dueDate, "INVALID_DUE_DATE", "Due date must use YYYY-MM-DD")
      : existingReminder.dueDate;
    const effectiveReminderDate = input.reminderDate
      ? parseDateInput(
          input.reminderDate,
          "INVALID_REMINDER_DATE",
          "Reminder date must use YYYY-MM-DD"
        )
      : existingReminder.reminderDate;

    validateReminderWindow(effectiveReminderDate, effectiveDueDate);

    const reminder = await this.fiscalRemindersRepository.update(reminderId, {
      title: input.title,
      description: input.description,
      dueDate: input.dueDate ? effectiveDueDate : undefined,
      reminderDate: input.reminderDate ? effectiveReminderDate : undefined,
      severity: input.severity ? mapSeverityToEnum(input.severity) : undefined,
      resolvedAt: input.resolved === undefined ? undefined : input.resolved ? new Date() : null
    });

    return mapReminder(reminder);
  }
}

function mapReminder(reminder: FiscalReminderRecord, referenceDate = normalizeDate(new Date())) {
  return {
    id: reminder.id,
    title: reminder.title,
    description: reminder.description,
    dueDate: reminder.dueDate.toISOString().slice(0, 10),
    reminderDate: reminder.reminderDate.toISOString().slice(0, 10),
    severity: mapSeverity(reminder.severity),
    status: getReminderStatus(reminder, referenceDate),
    resolvedAt: reminder.resolvedAt?.toISOString() ?? null,
    createdAt: reminder.createdAt.toISOString(),
    updatedAt: reminder.updatedAt.toISOString()
  };
}

function getReminderStatus(reminder: FiscalReminderRecord, referenceDate: Date) {
  if (reminder.resolvedAt) {
    return "resolved";
  }

  const dueDate = normalizeDate(reminder.dueDate);

  if (referenceDate.getTime() > dueDate.getTime()) {
    return "overdue";
  }

  if (referenceDate.getTime() === dueDate.getTime()) {
    return "due_today";
  }

  return "upcoming";
}

function mapSeverity(severity: string) {
  const severityMap: Record<string, string> = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high"
  };

  return severityMap[severity] ?? severity.toLowerCase();
}

function mapSeverityToEnum(severity: "low" | "medium" | "high") {
  const severityMap = {
    low: "LOW",
    medium: "MEDIUM",
    high: "HIGH"
  } as const;

  return severityMap[severity];
}

function validateReminderWindow(reminderDate: Date, dueDate: Date) {
  if (reminderDate.getTime() > dueDate.getTime()) {
    throw new AppError(
      400,
      "INVALID_REMINDER_DATE",
      "Reminder date cannot be after due date"
    );
  }
}

function parseOptionalReferenceDate(referenceDate?: string) {
  if (!referenceDate) {
    return normalizeDate(new Date());
  }

  return parseDateInput(
    referenceDate,
    "INVALID_REFERENCE_DATE",
    "Reference date must use YYYY-MM-DD"
  );
}

function parseDateInput(input: string, code: string, message: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    throw new AppError(400, code, message);
  }

  const parsedDate = new Date(`${input}T00:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new AppError(400, code, message);
  }

  return parsedDate;
}

function normalizeDate(date: Date) {
  return new Date(`${date.toISOString().slice(0, 10)}T00:00:00.000Z`);
}
