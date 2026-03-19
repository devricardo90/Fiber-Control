import type { FastifyInstance } from "fastify";

import { requireAuth } from "../../plugins/auth.js";
import { ReportsRepository } from "./reports.repository.js";
import {
  annualSummaryReportSchema,
  customerDetailReportSchema,
  monthlyRevenueReportSchema,
  overdueReportSchema,
  regionReportSchema
} from "./reports.schema.js";
import { ReportsService } from "./reports.service.js";

const reportsRepository = new ReportsRepository();
const reportsService = new ReportsService(reportsRepository);

export async function reportsRoutes(app: FastifyInstance): Promise<void> {
  app.get("/monthly-revenue", { schema: monthlyRevenueReportSchema, preHandler: requireAuth }, async (request) => {
    const query = request.query as { referenceMonth?: string };
    const report = await reportsService.getMonthlyRevenueReport(query.referenceMonth);

    return {
      data: report
    };
  });

  app.get("/annual-summary", { schema: annualSummaryReportSchema, preHandler: requireAuth }, async (request) => {
    const query = request.query as { year?: string };
    const report = await reportsService.getAnnualSummaryReport(query.year);

    return {
      data: report
    };
  });

  app.get("/overdue", { schema: overdueReportSchema, preHandler: requireAuth }, async () => {
    const report = await reportsService.getOverdueReport();

    return {
      data: report
    };
  });

  app.get("/regions", { schema: regionReportSchema, preHandler: requireAuth }, async (request) => {
    const query = request.query as { referenceMonth?: string };
    const report = await reportsService.getRegionReport(query.referenceMonth);

    return {
      data: report
    };
  });

  app.get("/customers/:id", { schema: customerDetailReportSchema, preHandler: requireAuth }, async (request) => {
    const params = request.params as { id: string };
    const report = await reportsService.getCustomerDetailReport(params.id);

    return {
      data: report
    };
  });
}
