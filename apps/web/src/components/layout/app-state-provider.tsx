"use client";

import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";

export type AppNotification = {
  id: string;
  message: string;
  tone: "info" | "warning" | "danger";
};

type AppStateContextValue = {
  isOnline: boolean;
  notification: AppNotification | null;
  notify: (payload: Omit<AppNotification, "id">) => void;
  clearNotification: () => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [isOnline, setIsOnline] = useState(true);
  const [notification, setNotification] = useState<AppNotification | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateStatus = () => {
      setIsOnline(window.navigator.onLine);
    };

    updateStatus();
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  const notify = useCallback((payload: Omit<AppNotification, "id">) => {
    const generatedId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}`;
    setNotification({
      ...payload,
      id: generatedId
    });
  }, []);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const value: AppStateContextValue = {
    isOnline,
    notification,
    notify,
    clearNotification
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }

  return context;
}
