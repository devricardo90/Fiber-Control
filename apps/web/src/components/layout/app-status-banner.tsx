"use client";

import { useMemo } from "react";

import { StatusChip } from "@/components/foundation/status-chip";

import { useAppState } from "./app-state-provider";
import { useAuth } from "./auth-provider";

export function AppStatusBanner() {
  const { clearNotification, isOnline, notification } = useAppState();
  const { sessionExpiresInMs, sessionState } = useAuth();

  const sessionLabel = useMemo(() => {
    if (sessionState === "active" && sessionExpiresInMs) {
      const minutes = Math.max(Math.floor(sessionExpiresInMs / 60_000), 1);
      return `Session active - ${minutes} min remaining`;
    }

    if (sessionState === "expiring") {
      const minutes = sessionExpiresInMs ? Math.max(Math.ceil(sessionExpiresInMs / 60_000), 1) : 1;
      return `Session expiring - ${minutes} min remaining`;
    }

    if (sessionState === "expired") {
      return "Session expired";
    }

    return null;
  }, [sessionExpiresInMs, sessionState]);

  return (
    <div className="mb-5 flex flex-wrap gap-2">
      <StatusChip
        label={isOnline ? "Browser connected" : "Offline mode"}
        tone={isOnline ? "info" : "danger"}
      />
      {sessionLabel ? (
        <StatusChip
          label={sessionLabel}
          tone={sessionState === "expiring" ? "warning" : sessionState === "expired" ? "danger" : "success"}
        />
      ) : null}
      {notification ? (
        <button type="button" onClick={clearNotification} className="text-left">
          <StatusChip label={notification.message} tone={notification.tone} />
        </button>
      ) : null}
    </div>
  );
}
