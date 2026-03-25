"use client";

import { useMemo } from "react";

import { useAppState } from "./app-state-provider";
import { useAuth } from "./auth-provider";

const TONE_MAP: Record<string, "success" | "warning" | "danger"> = {
  active: "success",
  expiring: "warning",
  expired: "danger",
  idle: "info"
};

export function AppStatusBanner() {
  const { isOnline, notification, clearNotification } = useAppState();
  const { sessionState, sessionExpiresInMs } = useAuth();

  const sessionLabel = useMemo(() => {
    if (sessionState === "active" && sessionExpiresInMs) {
      const minutes = Math.max(Math.floor(sessionExpiresInMs / 60_000), 1);
      return `Session active · ${minutes} min remaining`;
    }

    if (sessionState === "expiring") {
      const minutes = sessionExpiresInMs ? Math.max(Math.ceil(sessionExpiresInMs / 60_000), 1) : null;
      return minutes ? `Expiring in ${minutes} min` : "Session expiring soon";
    }

    if (sessionState === "expired") {
      return "Session expired";
    }

    return null;
  }, [sessionExpiresInMs, sessionState]);

  const sessionTone = TONE_MAP[sessionState] ?? "info";

  return (
    <div className="app-status-row">
      <span className="status-pill" data-tone={isOnline ? "info" : "danger"}>
        {isOnline ? "Connected" : "Offline mode"}
      </span>
      {sessionLabel && (
        <span className="status-pill" data-tone={sessionTone}>
          {sessionLabel}
        </span>
      )}
      {notification && (
        <span className="status-pill" data-tone={notification.tone}>
          <span>{notification.message}</span>
          <button
            type="button"
            aria-label="Dismiss notification"
            className="status-dismiss"
            onClick={clearNotification}
          >
            Dismiss
          </button>
        </span>
      )}
    </div>
  );
}
