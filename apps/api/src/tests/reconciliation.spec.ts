import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";

import { buildApp } from "../app.js";
import { prisma } from "../lib/prisma.js";

type BankEntryDelegate = {
  deleteMany(): Promise<unknown>;
  create(args: { data: Record<string, unknown> }): Promise<{ id: string; status: string }>;
  findUnique(args: { where: { id: string } }): Promise<{ status: string } | null>;
  createMany(args: { data: Array<Record<string, unknown>> }): Promise<unknown>;
};

function bankEntryDelegate() {
  return (prisma as unknown as { bankEntry: BankEntryDelegate }).bankEntry;
}

describe("Reconciliation routes", () => {
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

  it("should manually match a bank entry to a payment", async () => {
    const accessToken = await registerAndLogin(app);
    const customer = await prisma.customer.create({
      data: {
        fullName: "Julia Match",
        monthlyFee: 100,
        dueDay: 10,
        graceDays: 2,
        cutoffDays: 5,
        status: "OVERDUE"
      }
    });
    const payment = await prisma.payment.create({
      data: {
        customerId: customer.id,
        referenceMonth: "2026-03",
        expectedAmount: 100,
        receivedAmount: 40,
        status: "PARTIAL",
        paidAt: new Date("2026-03-10T10:00:00.000Z")
      }
    });
    const bankEntry = await bankEntryDelegate().create({
      data: {
        amount: 60,
        occurredAt: new Date("2026-03-19T10:00:00.000Z"),
        description: "PIX complemento",
        status: "UNMATCHED"
      }
    });

    const response = await request(app.server)
      .post("/reconciliation/match")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        bankEntryId: bankEntry.id,
        paymentId: payment.id
      });

    const updatedBankEntry = await bankEntryDelegate().findUnique({
      where: { id: bankEntry.id }
    });
    const updatedPayment = await prisma.payment.findUniqueOrThrow({
      where: { id: payment.id }
    });

    expect(response.status).toBe(200);
    expect(response.body.data.bankEntry.status).toBe("matched");
    expect(response.body.data.payment.receivedAmount).toBe(100);
    expect(response.body.data.payment.status).toBe("paid");
    if (!updatedBankEntry) {
      throw new Error("Expected bank entry to exist after reconciliation");
    }
    expect(updatedBankEntry.status).toBe("MATCHED");
    expect(updatedPayment.status).toBe("PAID");
  });

  it("should reject matching an already matched bank entry", async () => {
    const accessToken = await registerAndLogin(app);
    const customer = await prisma.customer.create({
      data: {
        fullName: "Marcos Match",
        monthlyFee: 100,
        dueDay: 10,
        graceDays: 2,
        cutoffDays: 5
      }
    });
    const payment = await prisma.payment.create({
      data: {
        customerId: customer.id,
        referenceMonth: "2026-03",
        expectedAmount: 100,
        receivedAmount: 100,
        status: "PAID",
        paidAt: new Date("2026-03-10T10:00:00.000Z")
      }
    });
    const bankEntry = await bankEntryDelegate().create({
      data: {
        amount: 100,
        occurredAt: new Date("2026-03-19T10:00:00.000Z"),
        status: "MATCHED",
        paymentId: payment.id
      }
    });

    const response = await request(app.server)
      .post("/reconciliation/match")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        bankEntryId: bankEntry.id,
        paymentId: payment.id
      });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("BANK_ENTRY_ALREADY_MATCHED");
  });

  it("should return reconciliation overview", async () => {
    const accessToken = await registerAndLogin(app);
    const customer = await prisma.customer.create({
      data: {
        fullName: "Paula Recon",
        monthlyFee: 100,
        dueDay: 10,
        graceDays: 2,
        cutoffDays: 5
      }
    });
    const payment = await prisma.payment.create({
      data: {
        customerId: customer.id,
        referenceMonth: "2026-03",
        expectedAmount: 100,
        receivedAmount: 40,
        status: "PARTIAL",
        paidAt: new Date("2026-03-10T10:00:00.000Z")
      }
    });
    await bankEntryDelegate().createMany({
      data: [
        {
          amount: 40,
          occurredAt: new Date("2026-03-19T10:00:00.000Z"),
          status: "MATCHED",
          paymentId: payment.id
        },
        {
          amount: 20,
          occurredAt: new Date("2026-03-20T10:00:00.000Z"),
          status: "UNMATCHED",
          description: "Unknown PIX"
        }
      ]
    });

    const response = await request(app.server)
      .get("/reconciliation/overview?referenceMonth=2026-03")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.summary.matchedEntries).toBe(1);
    expect(response.body.data.summary.unmatchedEntries).toBe(1);
    expect(response.body.data.summary.missingPayments).toBe(1);
    expect(response.body.data.summary.matchedAmount).toBe(40);
    expect(response.body.data.summary.unmatchedAmount).toBe(20);
    expect(response.body.data.summary.missingAmount).toBe(60);
    expect(response.body.data.unmatchedEntries).toHaveLength(1);
    expect(response.body.data.missingPayments).toHaveLength(1);
  });

  it("should reject unauthenticated access", async () => {
    const response = await request(app.server).get("/reconciliation/overview");

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });
});

async function registerAndLogin(app: FastifyInstance) {
  const response = await request(app.server).post("/auth/register").send({
    fullName: "Recon Admin",
    email: "recon@fiber.dev",
    password: "StrongPass123"
  });

  return response.body.data.accessToken as string;
}
