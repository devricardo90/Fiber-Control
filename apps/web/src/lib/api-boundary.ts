import { appConfig } from "./config";

export const apiBoundary = {
  baseUrl: appConfig.apiUrl,
  authStorageKey: "fiber-control.access-token",
  routes: [
    { method: "GET", path: "/health", purpose: "Availability check" },
    { method: "POST", path: "/auth/login", purpose: "Session start" },
    { method: "GET", path: "/auth/me", purpose: "Current user context" }
  ]
} as const;
