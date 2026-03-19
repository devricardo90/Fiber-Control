import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";

import { buildApp } from "../app.js";
import { prisma } from "../lib/prisma.js";

describe("Tax config routes", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  beforeEach(async () => {
    await prisma.taxConfig.deleteMany();
    await prisma.user.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.region.deleteMany();
  });

  afterAll(async () => {
    await prisma.taxConfig.deleteMany();
    await prisma.user.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.region.deleteMany();
    await app.close();
  });

  it("should return null when tax config is not set", async () => {
    const accessToken = await registerAndLogin(app);

    const response = await request(app.server)
      .get("/tax-config")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toBeNull();
  });

  it("should create tax config", async () => {
    const accessToken = await registerAndLogin(app);

    const response = await request(app.server)
      .put("/tax-config")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        regimeLabel: "Simples Nacional",
        estimatedRate: 6,
        dueDay: 20,
        notes: "DAS mensal"
      });

    expect(response.status).toBe(200);
    expect(response.body.data.regimeLabel).toBe("Simples Nacional");
    expect(response.body.data.estimatedRate).toBe(6);
    expect(response.body.data.dueDay).toBe(20);
    expect(response.body.data.notes).toBe("DAS mensal");
  });

  it("should update existing tax config", async () => {
    const accessToken = await registerAndLogin(app);

    await prisma.taxConfig.create({
      data: {
        singletonKey: "default",
        regimeLabel: "Simples Nacional",
        estimatedRate: 6,
        dueDay: 20
      }
    });

    const response = await request(app.server)
      .put("/tax-config")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        regimeLabel: "Lucro Presumido",
        estimatedRate: 11.5,
        dueDay: 25
      });

    expect(response.status).toBe(200);
    expect(response.body.data.regimeLabel).toBe("Lucro Presumido");
    expect(response.body.data.estimatedRate).toBe(11.5);
    expect(response.body.data.dueDay).toBe(25);

    const saved = await prisma.taxConfig.findUnique({
      where: {
        singletonKey: "default"
      }
    });

    expect(saved?.regimeLabel).toBe("Lucro Presumido");
  });

  it("should return estimated tax values for the reference month", async () => {
    const accessToken = await registerAndLogin(app);
    const customer = await prisma.customer.create({
      data: {
        fullName: "Marcos Silva",
        monthlyFee: 100,
        dueDay: 10,
        graceDays: 2,
        cutoffDays: 5
      }
    });

    await prisma.taxConfig.create({
      data: {
        singletonKey: "default",
        regimeLabel: "Simples Nacional",
        estimatedRate: 6,
        dueDay: 20
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
        }
      ]
    });

    const response = await request(app.server)
      .get("/tax-config/estimate?referenceMonth=2026-03")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.referenceMonth).toBe("2026-03");
    expect(response.body.data.grossRevenueThisMonth).toBe(100);
    expect(response.body.data.grossRevenueThisYear).toBe(140);
    expect(response.body.data.estimatedTaxThisMonth).toBe(6);
    expect(response.body.data.estimatedTaxThisYear).toBe(8.4);
  });

  it("should reject invalid payload", async () => {
    const accessToken = await registerAndLogin(app);

    const response = await request(app.server)
      .put("/tax-config")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        regimeLabel: "Simples Nacional",
        estimatedRate: 0,
        dueDay: 32
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("should reject unauthenticated access", async () => {
    const response = await request(app.server).get("/tax-config");

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });

  it("should return 404 when estimating without tax config", async () => {
    const accessToken = await registerAndLogin(app);

    const response = await request(app.server)
      .get("/tax-config/estimate?referenceMonth=2026-03")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("TAX_CONFIG_NOT_FOUND");
  });
});

async function registerAndLogin(app: FastifyInstance) {
  const response = await request(app.server).post("/auth/register").send({
    fullName: "Tax Admin",
    email: "tax@fiber.dev",
    password: "StrongPass123"
  });

  return response.body.data.accessToken as string;
}
