import type { FastifyInstance } from "fastify";

import { requireAuth } from "../../plugins/auth.js";
import {
  createBankEntrySchema,
  listBankEntriesSchema
} from "./bank-entries.schema.js";
import { BankEntriesRepository } from "./bank-entries.repository.js";
import { BankEntriesService } from "./bank-entries.service.js";

const bankEntriesRepository = new BankEntriesRepository();
const bankEntriesService = new BankEntriesService(bankEntriesRepository);

export async function bankEntriesRoutes(app: FastifyInstance): Promise<void> {
  app.post("/", { schema: createBankEntrySchema, preHandler: requireAuth }, async (request, reply) => {
    const body = request.body as {
      amount: number;
      occurredAt: string;
      description?: string;
      referenceCode?: string;
      source?: string;
    };
    const entry = await bankEntriesService.createEntry(body);

    return reply.status(201).send({
      data: entry
    });
  });

  app.get("/", { schema: listBankEntriesSchema, preHandler: requireAuth }, async () => {
    const entries = await bankEntriesService.listEntries();

    return {
      data: entries
    };
  });
}
