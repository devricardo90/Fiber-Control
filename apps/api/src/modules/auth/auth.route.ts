import type { FastifyInstance } from "fastify";

import { requireAuth } from "../../plugins/auth.js";
import { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";
import { loginSchema, meSchema, registerSchema } from "./auth.schema.js";

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post("/register", { schema: registerSchema }, async (request, reply) => {
    const body = request.body as {
      fullName: string;
      email: string;
      password: string;
    };
    const result = await authService.register(body);

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
}
