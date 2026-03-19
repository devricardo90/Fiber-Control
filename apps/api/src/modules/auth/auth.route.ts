import type { FastifyInstance } from "fastify";

import { optionalAuth, requireAdmin, requireAuth } from "../../plugins/auth.js";
import { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";
import {
  listUsersSchema,
  loginSchema,
  meSchema,
  registerSchema,
  updateUserSchema
} from "./auth.schema.js";

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post("/register", { schema: registerSchema, preHandler: optionalAuth }, async (request, reply) => {
    const body = request.body as {
      fullName: string;
      email: string;
      password: string;
    };
    const result = await authService.register(body, request.currentUser);

    return reply.status(201).send({
      data: result
    });
  });

  app.post("/login", { schema: loginSchema }, async (request) => {
    const body = request.body as {
      email: string;
      password: string;
    };
    const result = await authService.login(body);

    return {
      data: result
    };
  });

  app.get("/me", { schema: meSchema, preHandler: requireAuth }, async (request) => {
    const user = await authService.getCurrentUser(request.currentUser!.id);

    return {
      data: user
    };
  });

  app.get("/users", { schema: listUsersSchema, preHandler: requireAdmin }, async () => {
    const users = await authService.listUsers();

    return {
      data: users
    };
  });

  app.patch("/users/:id", { schema: updateUserSchema, preHandler: requireAdmin }, async (request) => {
    const params = request.params as { id: string };
    const body = request.body as {
      fullName?: string;
      role?: "admin" | "operator";
      isActive?: boolean;
    };
    const user = await authService.updateUser(params.id, body);

    return {
      data: user
    };
  });
}
