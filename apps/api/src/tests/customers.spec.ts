import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";

import { buildApp } from "../app.js";
import { prisma } from "../lib/prisma.js";

describe("Customers routes", () => {
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

  it("should create a customer with valid data", async () => {
    const response = await request(app.server).post("/customers").send({
      fullName: "Ana Silva",
      documentId: "12345678901",
      monthlyFee: 129.9,
      dueDay: 10,
      graceDays: 3,
      cutoffDays: 5,
      serviceStartDate: "2026-03-01"
    });

    expect(response.status).toBe(201);
    expect(response.body.data.fullName).toBe("Ana Silva");
    expect(response.body.data.status).toBe("active");
    expect(response.body.data.monthlyFee).toBe(129.9);
    expect(response.body.data.serviceStartDate).toBe("2026-03-01");
  });

  it("should reject customer creation with invalid due day", async () => {
    const response = await request(app.server).post("/customers").send({
      fullName: "Bruno Costa",
      monthlyFee: 99.9,
      dueDay: 32
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("should reject duplicate customer document id", async () => {
    await prisma.customer.create({
      data: {
        fullName: "Carlos Souza",
        documentId: "11122233344",
        monthlyFee: 89.9,
        dueDay: 15,
        graceDays: 0,
        cutoffDays: 0
      }
    });

    const response = await request(app.server).post("/customers").send({
      fullName: "Carlos Souza 2",
      documentId: "11122233344",
      monthlyFee: 109.9,
      dueDay: 20
    });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("CUSTOMER_ALREADY_EXISTS");
  });

  it("should list customers ordered by full name", async () => {
    const region = await prisma.region.create({
      data: {
        name: "North Zone",
        code: "NORTH"
      }
    });

    await prisma.customer.createMany({
      data: [
        {
          fullName: "Zuleica Moraes",
          monthlyFee: 140,
          dueDay: 12,
          graceDays: 2,
          cutoffDays: 5,
          regionId: region.id
        },
        {
          fullName: "Aline Campos",
          monthlyFee: 120,
          dueDay: 8,
          graceDays: 1,
          cutoffDays: 4,
          regionId: region.id
        }
      ]
    });

    const response = await request(app.server).get("/customers");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0].fullName).toBe("Aline Campos");
    expect(response.body.data[0].region.name).toBe("North Zone");
    expect(response.body.data[1].fullName).toBe("Zuleica Moraes");
  });

  it("should return a customer by id", async () => {
    const customer = await prisma.customer.create({
      data: {
        fullName: "Daniel Rocha",
        monthlyFee: 150,
        dueDay: 6,
        graceDays: 2,
        cutoffDays: 4
      }
    });

    const response = await request(app.server).get(`/customers/${customer.id}`);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(customer.id);
    expect(response.body.data.fullName).toBe("Daniel Rocha");
  });

  it("should return 404 when customer id does not exist", async () => {
    const response = await request(app.server).get("/customers/customer-does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("CUSTOMER_NOT_FOUND");
  });

  it("should update a customer with valid data", async () => {
    const region = await prisma.region.create({
      data: {
        name: "East Zone",
        code: "EAST"
      }
    });

    const customer = await prisma.customer.create({
      data: {
        fullName: "Erica Lima",
        documentId: "55511122233",
        monthlyFee: 99.9,
        dueDay: 10,
        graceDays: 2,
        cutoffDays: 5
      }
    });

    const response = await request(app.server).patch(`/customers/${customer.id}`).send({
      fullName: "Erica Lima Santos",
      monthlyFee: 119.9,
      dueDay: 12,
      graceDays: 3,
      cutoffDays: 6,
      regionId: region.id
    });

    expect(response.status).toBe(200);
    expect(response.body.data.fullName).toBe("Erica Lima Santos");
    expect(response.body.data.monthlyFee).toBe(119.9);
    expect(response.body.data.dueDay).toBe(12);
    expect(response.body.data.region.id).toBe(region.id);
  });

  it("should return 404 when updating a non-existing customer", async () => {
    const response = await request(app.server).patch("/customers/customer-does-not-exist").send({
      fullName: "Nome Atualizado"
    });

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("CUSTOMER_NOT_FOUND");
  });

  it("should reject invalid customer update payload", async () => {
    const customer = await prisma.customer.create({
      data: {
        fullName: "Fabio Alves",
        monthlyFee: 89.9,
        dueDay: 9,
        graceDays: 1,
        cutoffDays: 2
      }
    });

    const response = await request(app.server).patch(`/customers/${customer.id}`).send({
      dueDay: 40
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("should reject duplicate document id on update", async () => {
    const firstCustomer = await prisma.customer.create({
      data: {
        fullName: "Gabriela Nunes",
        documentId: "99911122233",
        monthlyFee: 109.9,
        dueDay: 7,
        graceDays: 2,
        cutoffDays: 5
      }
    });

    await prisma.customer.create({
      data: {
        fullName: "Helio Castro",
        documentId: "00011122233",
        monthlyFee: 119.9,
        dueDay: 7,
        graceDays: 2,
        cutoffDays: 5
      }
    });

    const response = await request(app.server).patch(`/customers/${firstCustomer.id}`).send({
      documentId: "00011122233"
    });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("CUSTOMER_ALREADY_EXISTS");
  });

  it("should reject update when cutoff days are less than grace days", async () => {
    const customer = await prisma.customer.create({
      data: {
        fullName: "Isabela Melo",
        monthlyFee: 109.9,
        dueDay: 8,
        graceDays: 3,
        cutoffDays: 5
      }
    });

    const response = await request(app.server).patch(`/customers/${customer.id}`).send({
      graceDays: 6,
      cutoffDays: 4
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_CUTOFF_DAYS");
  });

  it("should reject empty update payload", async () => {
    const customer = await prisma.customer.create({
      data: {
        fullName: "Joao Mendes",
        monthlyFee: 129.9,
        dueDay: 11,
        graceDays: 2,
        cutoffDays: 4
      }
    });

    const response = await request(app.server).patch(`/customers/${customer.id}`).send({});

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("EMPTY_UPDATE_PAYLOAD");
  });

  it("should recalculate customer status to overdue for an unpaid period after grace days", async () => {
    const customer = await prisma.customer.create({
      data: {
        fullName: "Karina Souza",
        monthlyFee: 129.9,
        dueDay: 10,
        graceDays: 2,
        cutoffDays: 5,
        status: "ACTIVE"
      }
    });

    const response = await request(app.server).post(
      `/customers/${customer.id}/recalculate-status?referenceDate=2026-03-13`
    );

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("overdue");
  });

  it("should recalculate customer status to suspended after cutoff date", async () => {
    const customer = await prisma.customer.create({
      data: {
        fullName: "Luciana Prado",
        monthlyFee: 129.9,
        dueDay: 10,
        graceDays: 2,
        cutoffDays: 5,
        status: "ACTIVE"
      }
    });

    const response = await request(app.server).post(
      `/customers/${customer.id}/recalculate-status?referenceDate=2026-03-16`
    );

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("suspended");
  });
});
