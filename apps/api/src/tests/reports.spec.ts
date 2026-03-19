import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";

import { buildApp } from "../app.js";
import { prisma } from "../lib/prisma.js";

type BankEntryDelegate = {
  deleteMany(): Promise<unknown>;
};

function bankEntryDelegate() {
  return (prisma as unknown as { bankEntry: BankEntryDelegate }).bankEntry;
}

describe("Reports routes", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  beforeEach(async () => {
    await bankEntryDelegate().deleteMany();
    await prisma.payment.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.region.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await bankEntryDelegate().deleteMany();
    await prisma.payment.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.region.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it("should return monthly revenue report", async () => {
    const accessToken = await registerAndLogin(app);
    const region = await prisma.region.create({
      data: { name: "Central", code: "CTR" }
    });
    const customer = await prisma.customer.create({
      data: {
        fullName: "Renato Silva",
        monthlyFee: 100,
        dueDay: 10,
        graceDays: 2,
        cutoffDays: 5,
        regionId: region.id
      }
    });

    await prisma.payment.create({
      data: {
        customerId: customer.id,
        referenceMonth: "2026-03",
        expectedAmount: 100,
        receivedAmount: 70,
        status: "PARTIAL",
        paidAt: new Date("2026-03-10T10:00:00.000Z")
      }
    });

    const response = await request(app.server)
      .get("/reports/monthly-revenue?referenceMonth=2026-03")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.summary.totalPayments).toBe(1);
    expect(response.body.data.summary.expectedAmount).toBe(100);
    expect(response.body.data.summary.receivedAmount).toBe(70);
    expect(response.body.data.payments[0].regionName).toBe("Central");
  });

  it("should return annual summary report", async () => {
    const accessToken = await registerAndLogin(app);
    const customer = await prisma.customer.create({
      data: {
        fullName: "Camila Souza",
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
          referenceMonth: "2026-01",
          expectedAmount: 100,
          receivedAmount: 100,
          status: "PAID",
          paidAt: new Date("2026-01-10T10:00:00.000Z")
        },
        {
          customerId: customer.id,
          referenceMonth: "2026-02",
          expectedAmount: 100,
          receivedAmount: 40,
          status: "PARTIAL",
          paidAt: new Date("2026-02-10T10:00:00.000Z")
        }
      ]
    });

    const response = await request(app.server)
      .get("/reports/annual-summary?year=2026")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.year).toBe(2026);
    expect(response.body.data.summary.totalExpectedAmount).toBe(200);
    expect(response.body.data.summary.totalReceivedAmount).toBe(140);
    expect(response.body.data.monthlyBreakdown).toHaveLength(2);
  });

  it("should return overdue report", async () => {
    const accessToken = await registerAndLogin(app);
    const customer = await prisma.customer.create({
      data: {
        fullName: "Atrasado Teste",
        monthlyFee: 120,
        dueDay: 10,
        graceDays: 2,
        cutoffDays: 5,
        status: "OVERDUE"
      }
    });

    await prisma.payment.create({
      data: {
        customerId: customer.id,
        referenceMonth: "2026-03",
        expectedAmount: 120,
        receivedAmount: 20,
        status: "PARTIAL"
      }
    });

    const response = await request(app.server)
      .get("/reports/overdue")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.summary.totalCustomers).toBe(1);
    expect(response.body.data.customers[0].outstandingAmount).toBe(100);
  });

  it("should return region report", async () => {
    const accessToken = await registerAndLogin(app);
    const region = await prisma.region.create({
      data: { name: "North", code: "N" }
    });
    const customer = await prisma.customer.create({
      data: {
        fullName: "Cliente Norte",
        monthlyFee: 90,
        dueDay: 10,
        graceDays: 2,
        cutoffDays: 5,
        regionId: region.id
      }
    });

    await prisma.payment.create({
      data: {
        customerId: customer.id,
        referenceMonth: "2026-03",
        expectedAmount: 90,
        receivedAmount: 50,
        status: "PARTIAL"
      }
    });

    const response = await request(app.server)
      .get("/reports/regions?referenceMonth=2026-03")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.regions[0].regionName).toBe("North");
    expect(response.body.data.regions[0].outstandingAmount).toBe(40);
  });

  it("should return customer detail report", async () => {
    const accessToken = await registerAndLogin(app);
    const customer = await prisma.customer.create({
      data: {
        fullName: "Detalhe Cliente",
        monthlyFee: 80,
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
          expectedAmount: 80,
          receivedAmount: 80,
          status: "PAID",
          paidAt: new Date("2026-03-10T10:00:00.000Z")
        },
        {
          customerId: customer.id,
          referenceMonth: "2026-02",
          expectedAmount: 80,
          receivedAmount: 0,
          status: "PENDING"
        }
      ]
    });

    const response = await request(app.server)
      .get(`/reports/customers/${customer.id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.fullName).toBe("Detalhe Cliente");
    expect(response.body.data.totalPaidAmount).toBe(80);
    expect(response.body.data.totalOutstandingAmount).toBe(80);
    expect(response.body.data.payments).toHaveLength(2);
  });

  it("should reject unauthenticated access", async () => {
    const response = await request(app.server).get("/reports/monthly-revenue");

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });
});

async function registerAndLogin(app: FastifyInstance) {
  const response = await request(app.server).post("/auth/register").send({
    fullName: "Reports Admin",
    email: "reports@fiber.dev",
    password: "StrongPass123"
  });

  return response.body.data.accessToken as string;
}
