import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";

import { env } from "../config/env.js";

export async function registerSwagger(app: FastifyInstance): Promise<void> {
  await app.register(swagger, {
    openapi: {
      openapi: "3.0.3",
      info: {
        title: env.APP_NAME,
        description: "Fiber Control backend API",
        version: "0.1.0"
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "Bearer"
          }
        }
      }
    }
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs"
  });
}
