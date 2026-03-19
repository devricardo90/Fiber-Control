import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";

import { buildApp } from "../app.js";
import { prisma } from "../lib/prisma.js";

describe("Finance routes", () => {
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

  it("should return finance overview for a reference month", async () => {
    const customer = await prisma.customer.create({
      data: {
        fullName: "Renata Alves",
        monthlyFee: 100,
        dueDay: 10,
        graceDays: 2,
        cutoffDays: 5
      }
    });

    await prisma.payment.createMany({
      data: [
        {
          customerId: customer.id,
          referenceMonth: "2026-03",
          expectedAmount: 100,
          receivedAmount: 100,
          status: "PAID",
          paidAt: new Date("2026-03-10T10:00:00.000Z")
        },
        {
          customerId: customer.id,
          referenceMonth: "2026-02",
          expectedAmount: 100,
          receivedAmount: 40,
          status: "PARTIAL",
          paidAt: new Date("2026-02-10T10:00:00.000Z")
        },
        {
          customerId: customer.id,
          referenceMonth: "2025-12",
          expectedAmount: 90,
          receivedAmount: 90,
          status: "PAID",
          paidAt: new Date("2025-12-10T10:00:00.000Z")
        }
      ]
    });

    const response = await request(app.server).get("/finance/overview?referenceMonth=2026-03");

    expect(response.status).toBe(200);
    expect(response.body.data.referenceMonth).toBe("2026-03");
    expect(response.body.data.totalReceivedThisMonth).toBe(100);
    expect(response.body.data.totalReceivedThisYear).toBe(140);
    expect(response.body.data.totalReceivedLastYear).toBe(90);
    expect(response.body.data.expectedRevenueThisMonth).toBe(100);
    expect(response.body.data.overdueAmount).toBe(60);
    expect(response.body.data.outstandingAmount).toBe(60);
  });

  it("should reject invalid reference month", async () => {
    const response = await request(app.server).get("/finance/overview?referenceMonth=2026-13");

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("should return zeros when there are no payments", async () => {
    const response = await request(app.server).get("/finance/overview?referenceMonth=2026-03");

    expect(response.status).toBe(200);
    expect(response.body.data.totalReceivedThisMonth).toBe(0);
    expect(response.body.data.totalReceivedThisYear).toBe(0);
    expect(response.body.data.totalReceivedLastYear).toBe(0);
    expect(response.body.data.expectedRevenueThisMonth).toBe(0);
    expect(response.body.data.overdueAmount).toBe(0);
    expect(response.body.data.outstandingAmount).toBe(0);
  });
});
