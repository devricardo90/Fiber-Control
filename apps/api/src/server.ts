import { env } from "./config/env.js";
import { buildApp } from "./app.js";

async function bootstrap(): Promise<void> {
  const app = await buildApp();

  await app.listen({
    host: env.HOST,
    port: env.PORT
  });

  app.log.info(`${env.APP_NAME} running at ${env.APP_URL}`);
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
