import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    requestId: string;
  }
}

export async function registerRequestContext(app: FastifyInstance): Promise<void> {
  app.decorateRequest("requestId", "");

  app.addHook("onRequest", (request, reply, done) => {
    const requestId = randomUUID();
    request.requestId = requestId;
    request.log = request.log.child({ requestId });
    reply.header("x-request-id", requestId);
    done();
  });

  app.addHook("onResponse", (request, reply, done) => {
    const path = request.routerPath ?? request.url;

    request.log.info(
      {
        method: request.method,
        path,
        statusCode: reply.statusCode,
        userId: request.currentUser?.id ?? "anonymous"
      },
      "request completed"
    );

    done();
  });
}
