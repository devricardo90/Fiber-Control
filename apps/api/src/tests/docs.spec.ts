import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";

import { buildApp } from "../app.js";

describe("API documentation routes", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should expose Swagger UI", async () => {
    const response = await request(app.server).get("/docs");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Swagger UI");
  });

  it("should expose OpenAPI JSON", async () => {
    const response = await request(app.server).get("/openapi.json");

    expect(response.status).toBe(200);
    expect(response.body.info.title).toBe("Fiber Control API");
    expect(response.body.openapi).toBe("3.0.3");
  });

  it("should expose Scalar UI", async () => {
    const response = await request(app.server).get("/scalar");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Scalar.createApiReference");
    expect(response.text).toContain("/openapi.json");
  });
});
