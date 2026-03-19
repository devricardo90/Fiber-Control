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

  if (init.token) {
    headers.set("Authorization", `Bearer ${init.token}`);
  }

  const response = await fetch(`${appConfig.apiUrl}${path}`, {
    ...init,
    headers
  });

  if (!response.ok) {
    let payload: Partial<ApiError> = {};

    try {
      payload = (await response.json()) as Partial<ApiError>;
    } catch {
      payload = {};
    }

    throw {
      statusCode: response.status,
      code: payload.code ?? "REQUEST_FAILED",
      message: payload.message ?? "Request failed"
    } satisfies ApiError;
  }

  return (await response.json()) as T;
}
