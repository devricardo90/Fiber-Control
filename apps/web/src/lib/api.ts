import { appConfig } from "./config";

export type ApiError = {
  statusCode: number;
  code: string;
  message: string;
};

export async function apiRequest<T>(
  path: string,
  init: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  // Busca o token se não foi passado via init
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
    credentials: "include" // ✅ envia cookies automaticamente em toda requisição
  });

  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();

  if (!response.ok) {
    let payload: Partial<ApiError> = {};

    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = {};
    }

    throw {
      statusCode: response.status,
      code: payload.code ?? "REQUEST_FAILED",
      message: payload.message ?? "Request failed"
    } satisfies ApiError;
  }

  return (text ? JSON.parse(text) : {}) as T;
}
