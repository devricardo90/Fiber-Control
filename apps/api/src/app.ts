import Fastify, { type FastifyInstance } from "fastify";

import { alertsRoutes } from "./modules/alerts/alerts.route.js";
import { authRoutes } from "./modules/auth/auth.route.js";
import { bankEntriesRoutes } from "./modules/bank-entries/bank-entries.route.js";
import { customerRoutes } from "./modules/customers/customers.route.js";
import { financeRoutes } from "./modules/finance/finance.route.js";
import { fiscalRemindersRoutes } from "./modules/fiscal-reminders/fiscal-reminders.route.js";
import { healthRoutes } from "./modules/health/health.route.js";
import { paymentRoutes } from "./modules/payments/payments.route.js";
import { reconciliationRoutes } from "./modules/reconciliation/reconciliation.route.js";
import { reportsRoutes } from "./modules/reports/reports.route.js";
import { regionsRoutes } from "./modules/regions/regions.route.js";
import { taxConfigRoutes } from "./modules/tax-config/tax-config.route.js";
import { registerAuth } from "./plugins/auth.js";
import { registerErrorHandler } from "./plugins/error-handler.js";
import { registerCors } from "./plugins/cors.js";
import { registerScalar } from "./plugins/scalar.js";
import { registerSwagger } from "./plugins/swagger.js";

export async function buildApp(): Promise<FastifyInstance> {
  const isDev = process.env.NODE_ENV === "development";
  
  const app = Fastify({
    logger: {
      level: "info",
      transport: {
        targets: [
          {
            target: "pino/file",
            options: { destination: "./logs/app.log", mkdir: true },
          },
          ...(isDev ? [{
            target: "pino-pretty",
            options: { colorize: true }
          }] : [])
        ]
      }
    }
  });

  await registerCors(app);
  await registerSwagger(app);
  await registerScalar(app);
  await registerAuth(app);
  await registerErrorHandler(app);

  await app.register(healthRoutes, { prefix: "/health" });
  await app.register(authRoutes, { prefix: "/auth" });
  await app.register(bankEntriesRoutes, { prefix: "/bank-entries" });
  await app.register(customerRoutes, { prefix: "/customers" });
  await app.register(paymentRoutes, { prefix: "/payments" });
  await app.register(reconciliationRoutes, { prefix: "/reconciliation" });
  await app.register(reportsRoutes, { prefix: "/reports" });
  await app.register(regionsRoutes, { prefix: "/regions" });
  await app.register(financeRoutes, { prefix: "/finance" });
  await app.register(fiscalRemindersRoutes, { prefix: "/fiscal-reminders" });
  await app.register(alertsRoutes, { prefix: "/alerts" });
  await app.register(taxConfigRoutes, { prefix: "/tax-config" });

  return app;
}
