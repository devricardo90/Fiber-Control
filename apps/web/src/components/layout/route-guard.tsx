"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useAuth } from "./auth-provider";
import { LoadingScreen } from "../shared/loading-screen";

export function RouteGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && pathname !== "/login") {
      router.replace("/login");
    }

    if (isAuthenticated && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated && pathname !== "/login") {
    return null;
  }

  if (isAuthenticated && pathname === "/login") {
    return null;
  }

  return <>{children}</>;
}
