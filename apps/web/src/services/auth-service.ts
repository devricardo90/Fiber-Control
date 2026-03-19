import { apiRequest } from "@/lib/api";
import type { AuthUser, LoginResponse } from "@/types/auth";

export async function loginRequest(input: { email: string; password: string }) {
  const response = await apiRequest<{ data: LoginResponse }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return response.data;
}

export async function getCurrentUser(token: string) {
  const response = await apiRequest<{ data: AuthUser }>("/auth/me", {
    method: "GET",
    token
  });
  return response.data;
}
