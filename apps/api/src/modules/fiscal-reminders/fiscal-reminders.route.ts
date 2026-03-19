import type { FastifyInstance } from "fastify";

import { requireAuth } from "../../plugins/auth.js";
import {
  createFiscalReminderSchema,
  listFiscalRemindersSchema,
  updateFiscalReminderSchema
} from "./fiscal-reminders.schema.js";
import { FiscalRemindersRepository } from "./fiscal-reminders.repository.js";
import { FiscalRemindersService } from "./fiscal-reminders.service.js";

const fiscalRemindersRepository = new FiscalRemindersRepository();
const fiscalRemindersService = new FiscalRemindersService(fiscalRemindersRepository);

export async function fiscalRemindersRoutes(app: FastifyInstance): Promise<void> {
  app.post("/", { schema: createFiscalReminderSchema, preHandler: requireAuth }, async (request, reply) => {
    const body = request.body as {
      title: string;
      description?: string;
      dueDate: string;
      reminderDate: string;
      severity: "low" | "medium" | "high";
    };
    const reminder = await fiscalRemindersService.createReminder(body);

    return reply.status(201).send({
      data: reminder
    });
  });

  app.get("/", { schema: listFiscalRemindersSchema, preHandler: requireAuth }, async (request) => {
    const query = request.query as { referenceDate?: string };
    const reminders = await fiscalRemindersService.listReminders(query.referenceDate);

    return {
      data: reminders
    };
  });

  app.patch("/:id", { schema: updateFiscalReminderSchema, preHandler: requireAuth }, async (request) => {
    const params = request.params as { id: string };
    const body = request.body as {
      title?: string;
      description?: string;
      dueDate?: string;
      reminderDate?: string;
      severity?: "low" | "medium" | "high";
      resolved?: boolean;
    };
    const reminder = await fiscalRemindersService.updateReminder(params.id, body);

    return {
      data: reminder
    };
  });
}
