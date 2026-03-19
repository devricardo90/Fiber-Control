import type { FastifyInstance } from "fastify";

import { env } from "../../config/env.js";
import { healthSchema } from "./health.schema.js";

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get("/", { schema: healthSchema }, async () => {
    return {
      data: {
        status: "ok",
        service: env.APP_NAME,
        timestamp: new Date().toISOString()
      }
    };
  });
}
