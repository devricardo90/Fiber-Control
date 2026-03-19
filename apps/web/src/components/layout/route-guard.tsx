"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { useAuth } from "./auth-provider";

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
    }

    if (isAuthenticated && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "grid",
          minHeight: "100vh",
          placeItems: "center"
        }}
      >
        <div className="card" style={{ minWidth: 320 }}>
          <strong>Carregando sessão</strong>
          <p>Verificando autenticação e preparando a interface.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== "/login") {
    return null;
  }

  if (isAuthenticated && pathname === "/login") {
    return null;
  }

  return <>{children}</>;
}
