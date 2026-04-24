import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { FastifyInstance } from "fastify";

import { buildApp } from "../app.js";
import { prisma } from "../lib/prisma.js";

describe("Payments routes", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-19T00:00:00.000Z"));
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
    vi.useRealTimers();
  });

  it("should create a paid payment and recalculate the customer to active", async () => {
    const customer = await prisma.customer.create({
      data: {
        fullName: "Marina Duarte",
        monthlyFee: 129.9,
        dueDay: 10,
        graceDays: 2,
        cutoffDays: 5,
        status: "OVERDUE"
      }
    });

    const response = await request(app.server).post("/payments").send({
      customerId: customer.id,
      referenceMonth: "2026-03",
      receivedAmount: 129.9
    });

    const updatedCustomer = await prisma.customer.findUniqueOrThrow({
      where: { id: customer.id }
    });

    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe("paid");
    expect(response.body.data.expectedAmount).toBe(129.9);
    expect(response.body.data.customer.status).toBe("overdue");
    expect(updatedCustomer.status).toBe("ACTIVE");
  });

  it("should reject payment creation for an unknown customer", async () => {
    const response = await request(app.server).post("/payments").send({
      customerId: "customer-does-not-exist",
      referenceMonth: "2026-03",
      receivedAmount: 100
    });

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("CUSTOMER_NOT_FOUND");
  });

  it("should reject duplicate payment for the same reference month", async () => {
    const customer = await prisma.customer.create({
      data: {
        fullName: "Nadia Souza",
        monthlyFee: 89.9,
        dueDay: 5,
        graceDays: 1,
        cutoffDays: 2
      }
    });

    await prisma.payment.create({
      data: {
        customerId: customer.id,
        referenceMonth: "2026-03",
        expectedAmount: 89.9,
        receivedAmount: 89.9,
        status: "PAID",
        paidAt: new Date("2026-03-05T10:00:00.000Z")
      }
    });

    const response = await request(app.server).post("/payments").send({
      customerId: customer.id,
      referenceMonth: "2026-03",
      receivedAmount: 89.9
    });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("PAYMENT_REFERENCE_ALREADY_EXISTS");
  });

  it("should create a partial payment when received amount is below expected amount", async () => {
    const customer = await prisma.customer.create({
      data: {
        fullName: "Otavio Lima",
        monthlyFee: 150,
        dueDay: 8,
        graceDays: 2,
        cutoffDays: 5,
        status: "SUSPENDED"
      }
    });

    const response = await request(app.server).post("/payments").send({
      customerId: customer.id,
      referenceMonth: "2026-04",
      receivedAmount: 100
    });

    const unchangedCustomer = await prisma.customer.findUniqueOrThrow({
      where: { id: customer.id }
    });

    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe("partial");
    expect(response.body.data.paidAt).not.toBeNull();
    expect(unchangedCustomer.status).toBe("SUSPENDED");
  });

  it("should keep customer as due today when payment remains pending on due date", async () => {
    const customer = await prisma.customer.create({
      data: {
        fullName: "Rafaela Costa",
        monthlyFee: 150,
        dueDay: 19,
        graceDays: 2,
        cutoffDays: 5,
        status: "ACTIVE"
      }
    });

    const response = await request(app.server).post("/payments").send({
      customerId: customer.id,
      referenceMonth: "2026-03",
      receivedAmount: 0
    });

    const updatedCustomer = await prisma.customer.findUniqueOrThrow({
      where: { id: customer.id }
    });

    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe("pending");
    expect(updatedCustomer.status).toBe("DUE_TODAY");
  });

  it("should list payments ordered by reference month desc", async () => {
    const customer = await prisma.customer.create({
      data: {
        fullName: "Paula Martins",
        monthlyFee: 110,
        dueDay: 12,
        graceDays: 2,
        cutoffDays: 4
      }
    });

    await prisma.payment.createMany({
      data: [
        {
          customerId: customer.id,
          referenceMonth: "2026-02",
          expectedAmount: 110,
          receivedAmount: 0,
          status: "PENDING"
        },
        {
          customerId: customer.id,
          referenceMonth: "2026-03",
          expectedAmount: 110,
          receivedAmount: 110,
          status: "PAID",
          paidAt: new Date("2026-03-12T10:00:00.000Z")
        }
      ]
    });

    const response = await request(app.server).get("/payments");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0].referenceMonth).toBe("2026-03");
    expect(response.body.data[1].referenceMonth).toBe("2026-02");
  });
});
