import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";

import { buildApp } from "../app.js";
import { prisma } from "../lib/prisma.js";

describe("Regions routes", () => {
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

  it("should return performance grouped by region", async () => {
    const northRegion = await prisma.region.create({
      data: {
        name: "North Route",
        code: "NR"
      }
    });
    const southRegion = await prisma.region.create({
      data: {
        name: "South Route",
        code: "SR"
      }
    });

    const northActive = await prisma.customer.create({
      data: {
        fullName: "Ana Norte",
        monthlyFee: 100,
        dueDay: 10,
        graceDays: 2,
        cutoffDays: 5,
        status: "ACTIVE",
        regionId: northRegion.id
      }
    });
    const northOverdue = await prisma.customer.create({
      data: {
        fullName: "Bruno Norte",
        monthlyFee: 120,
        dueDay: 10,
        graceDays: 2,
        cutoffDays: 5,
        status: "OVERDUE",
        regionId: northRegion.id
      }
    });
    const southCustomer = await prisma.customer.create({
      data: {
        fullName: "Carla Sul",
        monthlyFee: 80,
        dueDay: 10,
        graceDays: 2,
        cutoffDays: 5,
        status: "ACTIVE",
        regionId: southRegion.id
      }
    });

    await prisma.payment.createMany({
      data: [
        {
          customerId: northActive.id,
          referenceMonth: "2026-03",
          expectedAmount: 100,
          receivedAmount: 100,
          status: "PAID",
          paidAt: new Date("2026-03-10T10:00:00.000Z")
        },
        {
          customerId: northOverdue.id,
          referenceMonth: "2026-03",
          expectedAmount: 120,
          receivedAmount: 20,
          status: "PARTIAL",
          paidAt: new Date("2026-03-10T10:00:00.000Z")
        },
        {
          customerId: southCustomer.id,
          referenceMonth: "2026-03",
          expectedAmount: 80,
          receivedAmount: 80,
          status: "PAID",
          paidAt: new Date("2026-03-10T10:00:00.000Z")
        }
      ]
    });

    const response = await request(app.server).get("/regions/performance?referenceMonth=2026-03");

    expect(response.status).toBe(200);
    expect(response.body.data.summary.totalRegions).toBe(2);
    expect(response.body.data.summary.totalCustomers).toBe(3);
    expect(response.body.data.summary.totalReceivedAmount).toBe(200);
    expect(response.body.data.summary.totalExpectedAmount).toBe(300);
    expect(response.body.data.summary.totalOutstandingAmount).toBe(100);
    expect(response.body.data.summary.totalOverdueCustomers).toBe(1);

    expect(response.body.data.regions[0].regionName).toBe("North Route");
    expect(response.body.data.regions[0].customerCount).toBe(2);
    expect(response.body.data.regions[0].overdueCustomers).toBe(1);
    expect(response.body.data.regions[0].receivedAmount).toBe(120);
    expect(response.body.data.regions[0].collectionRate).toBe(54.55);

    expect(response.body.data.regions[1].regionName).toBe("South Route");
    expect(response.body.data.regions[1].customerCount).toBe(1);
    expect(response.body.data.regions[1].receivedAmount).toBe(80);
  });

  it("should reject invalid reference month", async () => {
    const response = await request(app.server).get("/regions/performance?referenceMonth=2026-13");

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("should return empty summary when there are no regions", async () => {
    const response = await request(app.server).get("/regions/performance?referenceMonth=2026-03");

    expect(response.status).toBe(200);
    expect(response.body.data.summary.totalRegions).toBe(0);
    expect(response.body.data.summary.totalCustomers).toBe(0);
    expect(response.body.data.regions).toHaveLength(0);
  });
});
