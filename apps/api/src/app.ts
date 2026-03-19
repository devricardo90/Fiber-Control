import Fastify, { type FastifyInstance } from "fastify";

import { healthRoutes } from "./modules/health/health.route.js";
import { registerCors } from "./plugins/cors.js";
import { registerSwagger } from "./plugins/swagger.js";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true
  });

  await registerCors(app);
  await registerSwagger(app);

  await app.register(healthRoutes, { prefix: "/health" });

  return app;
}
