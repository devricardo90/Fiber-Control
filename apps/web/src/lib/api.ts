import { appConfig } from "./config";

export type ApiError = {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
  path?: string;
  requestId?: string;
  timestamp?: string;
};

export async function apiRequest<T>(
  path: string,
  init: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  let token = init.token;
  if (!token && typeof window !== "undefined") {
    token = window.localStorage.getItem("fiber-control.access-token");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${appConfig.apiUrl}${path}`, {
    ...init,
    headers,
    credentials: "include" // ✓ envia cookies automaticamente em toda requisição
  });

  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();

  if (!response.ok) {
    let payload: Partial<ApiError> = {};

    try {
      const parsed = text ? JSON.parse(text) : {};

      if (typeof parsed === "object" && parsed !== null) {
        if ("error" in parsed && typeof parsed.error === "object" && parsed.error !== null) {
          const errorSection = parsed.error as Partial<ApiError>;
          payload = {
            ...parsed,
            ...errorSection
          };
        } else {
          payload = parsed as Partial<ApiError>;
        }
      }
    } catch {
      payload = {};
    }

    throw {
      statusCode: payload.statusCode ?? response.status,
      code: payload.code ?? "REQUEST_FAILED",
      message: payload.message ?? "Request failed",
      details: payload.details,
      path: payload.path,
      requestId: payload.requestId,
      timestamp: payload.timestamp
    } satisfies ApiError;
  }

  return (text ? JSON.parse(text) : {}) as T;
}
