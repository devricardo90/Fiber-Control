"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState
} from "react";

import type { ApiError } from "@/lib/api";
import { getCurrentUser, loginRequest } from "@/services/auth-service";
import type { AuthUser, LoginResponse } from "@/types/auth";

const STORAGE_KEY = "fiber-control.access-token";

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: (tokenOverride?: string | null) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(STORAGE_KEY);

    if (storedToken) {
      setToken(storedToken);
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

  useEffect(() => {
    const apiError = currentUserQuery.error as ApiError | null;

    if (apiError?.statusCode === 401) {
      window.localStorage.removeItem(STORAGE_KEY);
      setToken(null);
      queryClient.removeQueries({
        queryKey: ["auth", "me"]
      });
    }
  }, [currentUserQuery.error, queryClient]);

  const loginMutation = useMutation({
    mutationFn: (input: { email: string; password: string }) => loginRequest(input),
    onSuccess: (response: LoginResponse) => {
      window.localStorage.setItem(STORAGE_KEY, response.accessToken);
      setToken(response.accessToken);
      queryClient.setQueryData(["auth", "me", response.accessToken], response.user);
    }
  });

  async function login(email: string, password: string) {
    await loginMutation.mutateAsync({
      email,
      password
    });
  }

  function logout() {
    window.localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    queryClient.removeQueries({
      queryKey: ["auth", "me"]
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

  const value: AuthContextValue = {
    token,
    user: currentUserQuery.data ?? null,
    isLoading:
      !isHydrated || loginMutation.isPending || (Boolean(token) && currentUserQuery.isLoading),
    isAuthenticated: Boolean(token && currentUserQuery.data),
    login,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
