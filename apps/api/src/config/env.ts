import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().min(1).default("0.0.0.0"),
  DATABASE_URL: z.string().min(1),
  APP_NAME: z.string().min(1),
  APP_URL: z.string().url(),
  CORS_ORIGIN: z.string().min(1)
});

export const env = envSchema.parse(process.env);
