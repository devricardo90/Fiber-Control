import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";

import { buildApp } from "../app.js";
import { prisma } from "../lib/prisma.js";

describe("Alerts routes", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  beforeEach(async () => {
    await prisma.payment.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.region.deleteMany();
  });

  afterAll(async () => {
    await prisma.payment.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.region.deleteMany();
    await app.close();
  });

  it("should return overdue, cutoff soon and pending payment alerts", async () => {
    const region = await prisma.region.create({
      data: {
        name: "Rural East",
        code: "RE"
      }
    });

    const overdueCustomer = await prisma.customer.create({
      data: {
        fullName: "Sonia Dias",
        monthlyFee: 100,
        dueDay: 10,
        graceDays: 2,
        cutoffDays: 5,
        status: "OVERDUE",
        regionId: region.id
      }
    });

    const cutoffSoonCustomer = await prisma.customer.create({
      data: {
        fullName: "Tiago Braga",
        monthlyFee: 120,
        dueDay: 10,
        graceDays: 3,
        cutoffDays: 5,
        status: "ACTIVE"
      }
    });

    await prisma.customer.create({
      data: {
        fullName: "Ursula Costa",
        monthlyFee: 140,
        dueDay: 25,
        graceDays: 2,
        cutoffDays: 6,
        status: "ACTIVE"
      }
    });

    await prisma.payment.createMany({
      data: [
        {
          customerId: overdueCustomer.id,
          referenceMonth: "2026-03",
          expectedAmount: 100,
          receivedAmount: 0,
          status: "PENDING"
        },
        {
          customerId: cutoffSoonCustomer.id,
          referenceMonth: "2026-03",
          expectedAmount: 120,
          receivedAmount: 20,
          status: "PARTIAL",
          paidAt: new Date("2026-03-11T10:00:00.000Z")
        }
      ]
    });

    const response = await request(app.server).get("/alerts/overview?referenceDate=2026-03-13");

    expect(response.status).toBe(200);
    expect(response.body.data.summary.totalAlerts).toBe(3);
    expect(response.body.data.summary.overdueCustomers).toBe(1);
    expect(response.body.data.summary.customersReachingCutoff).toBe(1);
    expect(response.body.data.summary.pendingPayments).toBe(1);
    expect(response.body.data.alerts[0].type).toBe("overdue_customer");
    expect(response.body.data.alerts[0].customer.regionName).toBe("Rural East");
    expect(response.body.data.alerts.some((alert: { type: string }) => alert.type === "cutoff_soon")).toBe(true);
    expect(response.body.data.alerts.some((alert: { type: string; customer: { fullName: string } }) =>
      alert.type === "pending_payment" && alert.customer.fullName === "Ursula Costa"
    )).toBe(true);
  });

  it("should return overdue_customer alert when customer.status is OVERDUE but referenceDate is before the grace limit", async () => {
    const region = await prisma.region.create({
      data: {
        name: "West Zone",
        code: "WZ"
      }
    });

    const statusOverdueCustomer = await prisma.customer.create({
      data: {
        fullName: "Camila Ferraz",
        monthlyFee: 110,
        dueDay: 10,
        graceDays: 5,
        cutoffDays: 10,
        status: "OVERDUE",
        regionId: region.id
      }
    });

    await prisma.payment.create({
      data: {
        customerId: statusOverdueCustomer.id,
        referenceMonth: "2026-03",
        expectedAmount: 110,
        receivedAmount: 0,
        status: "PENDING"
      }
    });

    // referenceDate is 2026-03-08 — before grace limit (dueDay 10 + graceDays 5 = 2026-03-15)
    // isDateOverdue = false, isAccountOverdue = true → overdue_customer with daysLate = 0
    const response = await request(app.server).get("/alerts/overview?referenceDate=2026-03-08");

    expect(response.status).toBe(200);
    expect(response.body.data.summary.overdueCustomers).toBe(1);
    expect(response.body.data.summary.totalAlerts).toBe(1);
    const alert = response.body.data.alerts[0];
    expect(alert.type).toBe("overdue_customer");
    expect(alert.customer.fullName).toBe("Camila Ferraz");
    expect(alert.daysLate).toBe(0);
  });

  it("should reject invalid reference date", async () => {
    const response = await request(app.server).get("/alerts/overview?referenceDate=2026-03-99");

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_REFERENCE_DATE");
  });

  it("should return an empty overview when there are no alerts", async () => {
    const customer = await prisma.customer.create({
      data: {
        fullName: "Vera Lima",
        monthlyFee: 100,
        dueDay: 10,
        graceDays: 2,
        cutoffDays: 5,
        status: "ACTIVE"
      }
    });

    await prisma.payment.create({
      data: {
        customerId: customer.id,
        referenceMonth: "2026-03",
        expectedAmount: 100,
        receivedAmount: 100,
        status: "PAID",
        paidAt: new Date("2026-03-10T10:00:00.000Z")
      }
    });

    const response = await request(app.server).get("/alerts/overview?referenceDate=2026-03-13");

    expect(response.status).toBe(200);
    expect(response.body.data.summary.totalAlerts).toBe(0);
    expect(response.body.data.alerts).toHaveLength(0);
  });
});
