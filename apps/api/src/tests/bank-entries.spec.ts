import type { BankEntry } from "../generated/prisma/client.js";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";

import { buildApp } from "../app.js";
import { prisma } from "../lib/prisma.js";

type BankEntryDelegate = {
  deleteMany(): Promise<unknown>;
  createMany(args: { data: Array<Record<string, unknown>> }): Promise<unknown>;
  create(args: { data: Record<string, unknown> }): Promise<BankEntry>;
};

function bankEntryDelegate() {
  return (prisma as unknown as { bankEntry: BankEntryDelegate }).bankEntry;
}

describe("Bank entries routes", () => {
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

  it("should create an unmatched bank entry", async () => {
    const accessToken = await registerAndLogin(app);

    const response = await request(app.server)
      .post("/bank-entries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        amount: 150.5,
        occurredAt: "2026-03-19T10:00:00.000Z",
        description: "PIX received",
        referenceCode: "PIX-123",
        source: "bank_app"
      });

    expect(response.status).toBe(201);
    expect(response.body.data.amount).toBe(150.5);
    expect(response.body.data.status).toBe("unmatched");
    expect(response.body.data.payment).toBeNull();
  });

  it("should list bank entries ordered by occurredAt desc", async () => {
    const accessToken = await registerAndLogin(app);

    await bankEntryDelegate().createMany({
      data: [
        {
          amount: 100,
          occurredAt: new Date("2026-03-18T10:00:00.000Z"),
          description: "Older entry",
          status: "UNMATCHED"
        },
        {
          amount: 120,
          occurredAt: new Date("2026-03-19T10:00:00.000Z"),
          description: "Newest entry",
          status: "UNMATCHED"
        }
      ]
    });

    const response = await request(app.server)
      .get("/bank-entries")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0].description).toBe("Newest entry");
    expect(response.body.data[1].description).toBe("Older entry");
  });

  it("should reject invalid payload", async () => {
    const accessToken = await registerAndLogin(app);

    const response = await request(app.server)
      .post("/bank-entries")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        amount: 0,
        occurredAt: "invalid-date"
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("should reject unauthenticated access", async () => {
    const response = await request(app.server).get("/bank-entries");

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });
});

async function registerAndLogin(app: FastifyInstance) {
  const response = await request(app.server).post("/auth/register").send({
    fullName: "Bank Admin",
    email: "bank@fiber.dev",
    password: "StrongPass123"
  });

  return response.body.data.accessToken as string;
}
