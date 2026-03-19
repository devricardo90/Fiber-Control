import Fastify, { type FastifyInstance } from "fastify";

import { alertsRoutes } from "./modules/alerts/alerts.route.js";
import { authRoutes } from "./modules/auth/auth.route.js";
import { customerRoutes } from "./modules/customers/customers.route.js";
import { financeRoutes } from "./modules/finance/finance.route.js";
import { healthRoutes } from "./modules/health/health.route.js";
import { paymentRoutes } from "./modules/payments/payments.route.js";
import { registerAuth } from "./plugins/auth.js";
import { registerErrorHandler } from "./plugins/error-handler.js";
import { registerCors } from "./plugins/cors.js";
import { registerScalar } from "./plugins/scalar.js";
import { registerSwagger } from "./plugins/swagger.js";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true
  });

  await registerCors(app);
  await registerSwagger(app);
  await registerScalar(app);
  await registerAuth(app);
  await registerErrorHandler(app);

  await app.register(healthRoutes, { prefix: "/health" });
  await app.register(authRoutes, { prefix: "/auth" });
  await app.register(customerRoutes, { prefix: "/customers" });
  await app.register(paymentRoutes, { prefix: "/payments" });
  await app.register(financeRoutes, { prefix: "/finance" });
  await app.register(alertsRoutes, { prefix: "/alerts" });

  return app;
}
