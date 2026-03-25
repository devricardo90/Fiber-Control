"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";

import type { ApiError } from "@/lib/api";
import { getCurrentUser, loginRequest } from "@/services/auth-service";
import type { AuthUser, LoginResponse } from "@/types/auth";

const STORAGE_KEY = "fiber-control.access-token";
const SESSION_WARNING_THRESHOLD_MS = 5 * 60_000;

type SessionState = "idle" | "active" | "expiring" | "expired";

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  sessionExpiresAt: string | null;
  sessionState: SessionState;
  sessionExpiresInMs: number | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: (tokenOverride?: string | null) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<string | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expiryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(STORAGE_KEY);

    if (storedToken) {
      setToken(storedToken);
      setSessionExpiresAt(getExpiresAtFromToken(storedToken));
    }

    setIsHydrated(true);
  }, []);

  const currentUserQuery = useQuery({
    queryKey: ["auth", "me", token],
    queryFn: async () => {
      if (!token) {
        throw new Error("Missing auth token");
      }

      return getCurrentUser(token);
    },
    enabled: isHydrated && Boolean(token)
  });

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setSessionExpiresAt(null);
    setSessionState("idle");
    queryClient.removeQueries({
      queryKey: ["auth", "me"]
    });
  }, [queryClient]);

  useEffect(() => {
    const apiError = currentUserQuery.error as ApiError | null;

    if (apiError?.statusCode === 401) {
      logout();
    }
  }, [currentUserQuery.error, logout]);

  const loginMutation = useMutation({
    mutationFn: (input: { email: string; password: string }) => loginRequest(input),
    onSuccess: (response: LoginResponse) => {
      window.localStorage.setItem(STORAGE_KEY, response.accessToken);
      setToken(response.accessToken);
      queryClient.setQueryData(["auth", "me", response.accessToken], response.user);
      const expiresAt = response.expiresAt ?? getExpiresAtFromToken(response.accessToken);
      setSessionExpiresAt(expiresAt);
    }
  });

  async function login(email: string, password: string) {
    await loginMutation.mutateAsync({
      email,
      password
    });
  }

  async function refreshUser(tokenOverride?: string | null) {
    const nextToken = tokenOverride ?? token;

    if (!nextToken) {
      return;
    }

    await queryClient.fetchQuery({
      queryKey: ["auth", "me", nextToken],
      queryFn: () => getCurrentUser(nextToken)
    });
  }

  useEffect(() => {
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }

    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }

    if (!sessionExpiresAt) {
      setSessionState("idle");
      return;
    }

    const expiresAtMs = Date.parse(sessionExpiresAt);

    if (Number.isNaN(expiresAtMs)) {
      setSessionState("idle");
      return;
    }

    const remaining = expiresAtMs - Date.now();

    if (remaining <= 0) {
      setSessionState("expired");
      logout();
      return;
    }

    const warningDelay = Math.max(remaining - SESSION_WARNING_THRESHOLD_MS, 0);

    warningTimerRef.current = setTimeout(() => {
      setSessionState("expiring");
    }, warningDelay);

    expiryTimerRef.current = setTimeout(() => {
      setSessionState("expired");
      logout();
    }, remaining);

    setSessionState(remaining <= SESSION_WARNING_THRESHOLD_MS ? "expiring" : "active");

    return () => {
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
        warningTimerRef.current = null;
      }
      if (expiryTimerRef.current) {
        clearTimeout(expiryTimerRef.current);
        expiryTimerRef.current = null;
      }
    };
  }, [sessionExpiresAt, logout]);

  const value: AuthContextValue = {
    token,
    user: currentUserQuery.data ?? null,
    isLoading:
      !isHydrated || loginMutation.isPending || (Boolean(token) && currentUserQuery.isLoading),
    isAuthenticated: Boolean(token && currentUserQuery.data),
    sessionExpiresAt,
    sessionState,
    sessionExpiresInMs: sessionExpiresAt
      ? Math.max(Date.parse(sessionExpiresAt) - Date.now(), 0)
      : null,
    login,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function getExpiresAtFromToken(token: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const [payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = atob(padded);
    const parsed = JSON.parse(decoded);

    if (typeof parsed.exp !== "number") {
      return null;
    }

    return new Date(parsed.exp * 1000).toISOString();
  } catch {
    return null;
  }
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
