"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { LoadingScreen } from "../shared/loading-screen";
import { useAuth } from "./auth-provider";

const FOUNDATION_ROUTES = [
  "/workspace",
  "/patterns",
  "/settings",
  "/customers",
  "/customers/new",
  "/payments",
  "/payments/new"
];

export function RouteGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated && pathname !== "/login") {
      router.replace("/login");
      return;
    }

    if (isAuthenticated && pathname === "/login") {
      router.replace("/workspace");
      return;
    }

    if (isAuthenticated && !FOUNDATION_ROUTES.includes(pathname)) {
      router.replace("/workspace");
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

  if (isAuthenticated && !FOUNDATION_ROUTES.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
