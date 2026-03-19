"use client";

import type { PropsWithChildren } from "react";

import { AuthProvider } from "./auth-provider";
import { QueryProvider } from "./query-provider";
import { RouteGuard } from "./route-guard";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <AuthProvider>
        <RouteGuard>{children}</RouteGuard>
      </AuthProvider>
    </QueryProvider>
  );
}
