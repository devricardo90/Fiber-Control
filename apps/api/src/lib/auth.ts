import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import { env } from "../config/env.js";

export const ACCESS_TOKEN_TTL_SECONDS = 60 * 60 * 12;
const PASSWORD_KEY_LENGTH = 64;

type AccessTokenPayload = {
  sub: string;
  email: string;
  role: "admin" | "operator";
  exp: number;
};

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, PASSWORD_KEY_LENGTH).toString("hex");

  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  const [salt, storedHash] = passwordHash.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const computedHash = scryptSync(password, salt, PASSWORD_KEY_LENGTH).toString("hex");

  return timingSafeEqual(Buffer.from(storedHash, "hex"), Buffer.from(computedHash, "hex"));
}

export function createAccessToken(input: {
  userId: string;
  email: string;
  role: "admin" | "operator";
}): string {
  const payload: AccessTokenPayload = {
    sub: input.userId,
    email: input.email,
    role: input.role,
    exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL_SECONDS
  };
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = signValue(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload);

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as AccessTokenPayload;

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function signValue(value: string): string {
  return createHmac("sha256", env.AUTH_SECRET).update(value).digest("base64url");
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function safeEqual(left: string, right: string): boolean {
  return timingSafeEqual(Buffer.from(left), Buffer.from(right));
}
