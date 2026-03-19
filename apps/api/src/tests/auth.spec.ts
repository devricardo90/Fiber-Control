import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";

import { buildApp } from "../app.js";
import { prisma } from "../lib/prisma.js";

describe("Auth routes", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.region.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.region.deleteMany();
    await app.close();
  });

  it("should register the first user as admin", async () => {
    const response = await request(app.server).post("/auth/register").send({
      fullName: "Admin User",
      email: "admin@fiber.dev",
      password: "StrongPass123"
    });

    expect(response.status).toBe(201);
    expect(response.body.data.user.role).toBe("admin");
    expect(response.body.data.accessToken).toEqual(expect.any(String));
  });

  it("should login with valid credentials", async () => {
    await request(app.server).post("/auth/register").send({
      fullName: "Operator User",
      email: "operator@fiber.dev",
      password: "StrongPass123"
    });

    const response = await request(app.server).post("/auth/login").send({
      email: "operator@fiber.dev",
      password: "StrongPass123"
    });

    expect(response.status).toBe(200);
    expect(response.body.data.user.email).toBe("operator@fiber.dev");
  });

  it("should reject invalid credentials", async () => {
    await request(app.server).post("/auth/register").send({
      fullName: "Operator User",
      email: "operator@fiber.dev",
      password: "StrongPass123"
    });

    const response = await request(app.server).post("/auth/login").send({
      email: "operator@fiber.dev",
      password: "WrongPass999"
    });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("should return the authenticated user", async () => {
    const registerResponse = await request(app.server).post("/auth/register").send({
      fullName: "Current User",
      email: "current@fiber.dev",
      password: "StrongPass123"
    });

    const response = await request(app.server)
      .get("/auth/me")
      .set("Authorization", `Bearer ${registerResponse.body.data.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe("current@fiber.dev");
  });

  it("should reject unauthenticated access to /auth/me", async () => {
    const response = await request(app.server).get("/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });

  it("should require admin to register another user after bootstrap", async () => {
    await request(app.server).post("/auth/register").send({
      fullName: "Admin User",
      email: "admin@fiber.dev",
      password: "StrongPass123"
    });

    const response = await request(app.server).post("/auth/register").send({
      fullName: "Second User",
      email: "second@fiber.dev",
      password: "StrongPass123"
    });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("FORBIDDEN");
  });

  it("should allow admin to register another user", async () => {
    const adminResponse = await request(app.server).post("/auth/register").send({
      fullName: "Admin User",
      email: "admin@fiber.dev",
      password: "StrongPass123"
    });

    const response = await request(app.server)
      .post("/auth/register")
      .set("Authorization", `Bearer ${adminResponse.body.data.accessToken}`)
      .send({
        fullName: "Operator User",
        email: "operator@fiber.dev",
        password: "StrongPass123"
      });

    expect(response.status).toBe(201);
    expect(response.body.data.user.role).toBe("operator");
  });

  it("should list users for admin", async () => {
    const adminResponse = await request(app.server).post("/auth/register").send({
      fullName: "Admin User",
      email: "admin@fiber.dev",
      password: "StrongPass123"
    });

    await request(app.server)
      .post("/auth/register")
      .set("Authorization", `Bearer ${adminResponse.body.data.accessToken}`)
      .send({
        fullName: "Operator User",
        email: "operator@fiber.dev",
        password: "StrongPass123"
      });

    const response = await request(app.server)
      .get("/auth/users")
      .set("Authorization", `Bearer ${adminResponse.body.data.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
  });

  it("should reject operator access to user management", async () => {
    const adminResponse = await request(app.server).post("/auth/register").send({
      fullName: "Admin User",
      email: "admin@fiber.dev",
      password: "StrongPass123"
    });

    const operatorResponse = await request(app.server)
      .post("/auth/register")
      .set("Authorization", `Bearer ${adminResponse.body.data.accessToken}`)
      .send({
        fullName: "Operator User",
        email: "operator@fiber.dev",
        password: "StrongPass123"
      });

    const response = await request(app.server)
      .get("/auth/users")
      .set("Authorization", `Bearer ${operatorResponse.body.data.accessToken}`);

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("FORBIDDEN");
  });

  it("should allow admin to update another user", async () => {
    const adminResponse = await request(app.server).post("/auth/register").send({
      fullName: "Admin User",
      email: "admin@fiber.dev",
      password: "StrongPass123"
    });

    const operatorResponse = await request(app.server)
      .post("/auth/register")
      .set("Authorization", `Bearer ${adminResponse.body.data.accessToken}`)
      .send({
        fullName: "Operator User",
        email: "operator@fiber.dev",
        password: "StrongPass123"
      });

    const response = await request(app.server)
      .patch(`/auth/users/${operatorResponse.body.data.user.id}`)
      .set("Authorization", `Bearer ${adminResponse.body.data.accessToken}`)
      .send({
        role: "admin",
        isActive: false
      });

    expect(response.status).toBe(200);
    expect(response.body.data.role).toBe("admin");
    expect(response.body.data.isActive).toBe(false);
  });

  it("should protect the last active admin", async () => {
    const adminResponse = await request(app.server).post("/auth/register").send({
      fullName: "Admin User",
      email: "admin@fiber.dev",
      password: "StrongPass123"
    });

    const response = await request(app.server)
      .patch(`/auth/users/${adminResponse.body.data.user.id}`)
      .set("Authorization", `Bearer ${adminResponse.body.data.accessToken}`)
      .send({
        role: "operator"
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("LAST_ADMIN_PROTECTION");
  });
});
