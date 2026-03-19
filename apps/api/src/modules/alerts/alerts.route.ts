import type { FastifyInstance } from "fastify";

import { AlertsRepository } from "./alerts.repository.js";
import { alertsOverviewSchema } from "./alerts.schema.js";
import { AlertsService } from "./alerts.service.js";

const alertsRepository = new AlertsRepository();
const alertsService = new AlertsService(alertsRepository);

export async function alertsRoutes(app: FastifyInstance): Promise<void> {
  app.get("/overview", { schema: alertsOverviewSchema }, async (request) => {
    const query = request.query as { referenceDate?: string };
    const overview = await alertsService.getOverview(query.referenceDate);

    return {
      data: overview
    };
  });
}
