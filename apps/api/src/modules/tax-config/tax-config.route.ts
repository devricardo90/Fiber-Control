import type { FastifyInstance } from "fastify";

import { requireAuth } from "../../plugins/auth.js";
import {
  getTaxConfigSchema,
  getTaxEstimateSchema,
  upsertTaxConfigSchema
} from "./tax-config.schema.js";
import { TaxConfigRepository } from "./tax-config.repository.js";
import { TaxConfigService } from "./tax-config.service.js";

const taxConfigRepository = new TaxConfigRepository();
const taxConfigService = new TaxConfigService(taxConfigRepository);

export async function taxConfigRoutes(app: FastifyInstance): Promise<void> {
  app.get("/", { schema: getTaxConfigSchema, preHandler: requireAuth }, async () => {
    const taxConfig = await taxConfigService.getTaxConfig();

    return {
      data: taxConfig
    };
  });

  app.put("/", { schema: upsertTaxConfigSchema, preHandler: requireAuth }, async (request) => {
    const body = request.body as {
      regimeLabel: string;
      estimatedRate: number;
      dueDay: number;
      notes?: string;
    };
    const taxConfig = await taxConfigService.upsertTaxConfig({
      regimeLabel: body.regimeLabel,
      estimatedRate: body.estimatedRate,
      dueDay: body.dueDay,
      notes: body.notes
    });

    return {
      data: taxConfig
    };
  });

  app.get("/estimate", { schema: getTaxEstimateSchema, preHandler: requireAuth }, async (request) => {
    const query = request.query as { referenceMonth?: string };
    const taxEstimate = await taxConfigService.getTaxEstimate(query.referenceMonth);

    return {
      data: taxEstimate
    };
  });
}
