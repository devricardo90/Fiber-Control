import type { FastifyInstance, FastifyRequest } from "fastify";

import { AppError } from "../lib/app-error.js";
import { verifyAccessToken } from "../lib/auth.js";

declare module "fastify" {
  interface FastifyRequest {
    currentUser: {
      id: string;
      email: string;
      role: "admin" | "operator";
    } | null;
  }
}

export async function registerAuth(app: FastifyInstance): Promise<void> {
  app.decorateRequest("currentUser", null);
}

export async function requireAuth(request: FastifyRequest): Promise<void> {
  const header = request.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new AppError(401, "UNAUTHORIZED", "Authentication is required");
  }

  const payload = verifyAccessToken(header.slice("Bearer ".length));

  if (!payload) {
    throw new AppError(401, "UNAUTHORIZED", "Invalid authentication token");
  }

  request.currentUser = {
    id: payload.sub,
    email: payload.email,
    role: payload.role
  };
}
