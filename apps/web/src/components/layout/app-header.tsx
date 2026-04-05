"use client";

import { usePathname } from "next/navigation";

import { StatusChip } from "@/components/foundation/status-chip";
import { navigationItems } from "@/config/navigation";
import { apiBoundary } from "@/lib/api-boundary";

import { useAppState } from "./app-state-provider";
import { useAuth } from "./auth-provider";

export function AppHeader() {
  const pathname = usePathname();
  const { isOnline } = useAppState();
  const { sessionState, user } = useAuth();

  const currentItem =
    navigationItems.find((item) => item.href === pathname) ?? navigationItems[0];

  return (
    <header className="border-b border-[var(--fc-border)] bg-[var(--fc-surface)] px-6 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
            Frontend foundation
          </p>
          <h1 className="mt-1 text-xl font-semibold text-[var(--fc-text)]">{currentItem.label}</h1>
          <p className="mt-1 text-sm text-[var(--fc-text-soft)]">{currentItem.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusChip
            label={isOnline ? "Browser online" : "Browser offline"}
            tone={isOnline ? "info" : "danger"}
          />
          <StatusChip
            label={sessionState === "expiring" ? "Session warning" : "Session tracked"}
            tone={sessionState === "expiring" ? "warning" : "success"}
          />
          <StatusChip label={`API ${apiBoundary.baseUrl}`} tone="neutral" />
          <StatusChip label={user?.role ?? "authenticated"} tone="neutral" />
        </div>
      </div>
    </header>
  );
}
