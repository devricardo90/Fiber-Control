import type { FiscalReminder } from "../generated/prisma/client.js";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { FastifyInstance } from "fastify";

import { buildApp } from "../app.js";
import { prisma } from "../lib/prisma.js";

type FiscalReminderDelegate = {
  deleteMany(): Promise<unknown>;
  createMany(args: { data: Array<Record<string, unknown>> }): Promise<unknown>;
  create(args: { data: Record<string, unknown> }): Promise<FiscalReminder>;
};

function fiscalReminderDelegate() {
  return (prisma as unknown as { fiscalReminder: FiscalReminderDelegate }).fiscalReminder;
}

describe("Fiscal reminders routes", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-19T00:00:00.000Z"));
    app = await buildApp();
    await app.ready();
  });

  beforeEach(async () => {
    await fiscalReminderDelegate().deleteMany();
    await prisma.taxConfig.deleteMany();
    await prisma.user.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.region.deleteMany();
  });

  afterAll(async () => {
    await fiscalReminderDelegate().deleteMany();
    await prisma.taxConfig.deleteMany();
    await prisma.user.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.region.deleteMany();
    await app.close();
    vi.useRealTimers();
  });

  it("should create a fiscal reminder", async () => {
    const accessToken = await registerAndLogin(app);

    const response = await request(app.server)
      .post("/fiscal-reminders")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "DAS March 2026",
        description: "Monthly DAS payment",
        dueDate: "2026-03-20",
        reminderDate: "2026-03-15",
        severity: "high"
      });

    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe("DAS March 2026");
    expect(response.body.data.status).toBe("upcoming");
    expect(response.body.data.severity).toBe("high");
  });

  it("should list reminders with derived statuses", async () => {
    const accessToken = await registerAndLogin(app);

    await fiscalReminderDelegate().createMany({
      data: [
        {
          title: "Accounting deadline",
          dueDate: new Date("2026-03-20T00:00:00.000Z"),
          reminderDate: new Date("2026-03-18T00:00:00.000Z"),
          severity: "MEDIUM"
        },
        {
          title: "DAS overdue",
          dueDate: new Date("2026-03-10T00:00:00.000Z"),
          reminderDate: new Date("2026-03-05T00:00:00.000Z"),
          severity: "HIGH"
        },
        {
          title: "Resolved note",
          dueDate: new Date("2026-03-12T00:00:00.000Z"),
          reminderDate: new Date("2026-03-10T00:00:00.000Z"),
          severity: "LOW",
          resolvedAt: new Date("2026-03-11T12:00:00.000Z")
        }
      ]
    });

    const response = await request(app.server)
      .get("/fiscal-reminders?referenceDate=2026-03-15")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(3);
    expect(response.body.data.find((item: { title: string }) => item.title === "Accounting deadline").status).toBe("upcoming");
    expect(response.body.data.find((item: { title: string }) => item.title === "DAS overdue").status).toBe("overdue");
    expect(response.body.data.find((item: { title: string }) => item.title === "Resolved note").status).toBe("resolved");
  });

  it("should update and resolve a reminder", async () => {
    const accessToken = await registerAndLogin(app);
    const reminder = await fiscalReminderDelegate().create({
      data: {
        title: "Simples tax",
        dueDate: new Date("2026-03-20T00:00:00.000Z"),
        reminderDate: new Date("2026-03-15T00:00:00.000Z"),
        severity: "HIGH"
      }
    });

    const response = await request(app.server)
      .patch(`/fiscal-reminders/${reminder.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Simples tax updated",
        resolved: true
      });

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe("Simples tax updated");
    expect(response.body.data.status).toBe("resolved");
    expect(response.body.data.resolvedAt).toEqual(expect.any(String));
  });

  it("should reject reminder date after due date", async () => {
    const accessToken = await registerAndLogin(app);

    const response = await request(app.server)
      .post("/fiscal-reminders")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Invalid reminder",
        dueDate: "2026-03-10",
        reminderDate: "2026-03-15",
        severity: "medium"
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_REMINDER_DATE");
  });

  it("should return 404 when updating a missing reminder", async () => {
    const accessToken = await registerAndLogin(app);

    const response = await request(app.server)
      .patch("/fiscal-reminders/reminder-does-not-exist")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        resolved: true
      });

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("FISCAL_REMINDER_NOT_FOUND");
  });

  it("should reject unauthenticated access", async () => {
    const response = await request(app.server).get("/fiscal-reminders");

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });
});

async function registerAndLogin(app: FastifyInstance) {
  const response = await request(app.server).post("/auth/register").send({
    fullName: "Fiscal Admin",
    email: "fiscal@fiber.dev",
    password: "StrongPass123"
  });

  return response.body.data.accessToken as string;
}
