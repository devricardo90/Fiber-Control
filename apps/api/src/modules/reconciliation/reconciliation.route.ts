import type { FastifyInstance } from "fastify";

import { requireAuth } from "../../plugins/auth.js";
import { ReconciliationRepository } from "./reconciliation.repository.js";
import {
  reconciliationMatchSchema,
  reconciliationOverviewSchema
} from "./reconciliation.schema.js";
import { ReconciliationService } from "./reconciliation.service.js";

const reconciliationRepository = new ReconciliationRepository();
const reconciliationService = new ReconciliationService(reconciliationRepository);

export async function reconciliationRoutes(app: FastifyInstance): Promise<void> {
  app.post("/match", { schema: reconciliationMatchSchema, preHandler: requireAuth }, async (request) => {
    const body = request.body as {
      bankEntryId: string;
      paymentId: string;
    };
    const result = await reconciliationService.matchBankEntryToPayment(body);

    return {
      data: result
    };
  });

  app.get("/overview", { schema: reconciliationOverviewSchema, preHandler: requireAuth }, async (request) => {
    const query = request.query as { referenceMonth?: string };
    const overview = await reconciliationService.getOverview(query.referenceMonth);

    return {
      data: overview
    };
  });
}
