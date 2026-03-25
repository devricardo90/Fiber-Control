"use client";

import type { PropsWithChildren } from "react";

import { AuthProvider } from "./auth-provider";
import { AppStateProvider } from "./app-state-provider";
import { QueryProvider } from "./query-provider";
import { RouteGuard } from "./route-guard";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <AppStateProvider>
        <AuthProvider>
          <RouteGuard>{children}</RouteGuard>
        </AuthProvider>
      </AppStateProvider>
    </QueryProvider>
  );
}
