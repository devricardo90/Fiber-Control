import type { FastifyInstance } from "fastify";

import { AppError } from "../lib/app-error.js";

type ErrorResponseBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  statusCode: number;
  requestId: string | null;
  path: string;
  timestamp: string;
};

export async function registerErrorHandler(app: FastifyInstance): Promise<void> {
  app.setErrorHandler((error, request, reply) => {
    const requestId = request.requestId ?? request.id ?? null;
    const timestamp = new Date().toISOString();

    request.log.error(
      {
        requestId,
        statusCode: reply.statusCode,
        method: request.method,
        path: request.url,
        code: error instanceof AppError ? error.code : undefined,
        details: error instanceof AppError ? error.details : undefined
      },
      error
    );

    if (error instanceof AppError) {
      const responseBody: ErrorResponseBody = {
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        },
        statusCode: error.statusCode,
        requestId,
        path: request.url,
        timestamp
      };

      return reply.status(error.statusCode).send(responseBody);
    }

    if (isValidationError(error)) {
      const responseBody: ErrorResponseBody = {
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          details: error.validation
        },
        statusCode: 400,
        requestId,
        path: request.url,
        timestamp
      };

      return reply.status(400).send(responseBody);
    }

    const responseBody: ErrorResponseBody = {
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred"
      },
      statusCode: 500,
      requestId,
      path: request.url,
      timestamp
    };

    return reply.status(500).send(responseBody);
  });
}

function isValidationError(error: unknown): error is { validation: unknown } {
  return typeof error === "object" && error !== null && "validation" in error;
}
