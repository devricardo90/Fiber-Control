import type { FastifyInstance } from "fastify";

import { RegionsRepository } from "./regions.repository.js";
import { regionsPerformanceSchema } from "./regions.schema.js";
import { RegionsService } from "./regions.service.js";

const regionsRepository = new RegionsRepository();
const regionsService = new RegionsService(regionsRepository);

export async function regionsRoutes(app: FastifyInstance): Promise<void> {
  app.get("/performance", { schema: regionsPerformanceSchema }, async (request) => {
    const query = request.query as { referenceMonth?: string };
    const performance = await regionsService.getPerformance(query.referenceMonth);

    return {
      data: performance
    };
  });
}
