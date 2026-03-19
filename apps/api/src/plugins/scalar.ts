import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

import type { FastifyInstance } from "fastify";

import { env } from "../config/env.js";

const require = createRequire(import.meta.url);

const scalarStandalonePath = require.resolve(
  "@scalar/api-reference/browser/standalone.js"
);

function getScalarHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${env.APP_NAME} - Scalar</title>
    <style>
      body {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script src="/scalar/browser/standalone.js"></script>
    <script>
      Scalar.createApiReference("#app", {
        url: "/openapi.json"
      });
    </script>
  </body>
</html>`;
}

export async function registerScalar(app: FastifyInstance): Promise<void> {
  app.get("/openapi.json", async () => {
    return app.swagger();
  });

  app.get("/scalar/browser/standalone.js", async (_, reply) => {
    const script = await readFile(scalarStandalonePath, "utf-8");

    return reply.type("application/javascript").send(script);
  });

  app.get("/scalar", async (_, reply) => {
    return reply.type("text/html").send(getScalarHtml());
  });
}
