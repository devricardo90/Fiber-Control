import type { FastifyInstance } from "fastify";

import { FinanceRepository } from "./finance.repository.js";
import { financeOverviewRouteSchema } from "./finance.schema.js";
import { FinanceService } from "./finance.service.js";

const financeRepository = new FinanceRepository();
const financeService = new FinanceService(financeRepository);

export async function financeRoutes(app: FastifyInstance): Promise<void> {
  app.get("/overview", { schema: financeOverviewRouteSchema }, async (request) => {
    const query = request.query as { referenceMonth?: string };
    const overview = await financeService.getOverview(query.referenceMonth);

    return {
      data: overview
    };
  });
}
