"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { FoundationButton } from "@/components/foundation/button";
import { navigationItems } from "@/config/navigation";

import { useAuth } from "./auth-provider";

export function AppSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="flex min-h-screen w-full max-w-64 flex-col border-r border-[var(--fc-border-strong)] bg-[var(--fc-sidebar)] px-4 py-5 text-[var(--fc-sidebar-text)]">
      <div className="border-b border-white/10 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
          Fiber Control
        </p>
        <h1 className="mt-2 text-lg font-semibold text-white">Operational Frontend</h1>
      </div>

      <nav className="mt-5 flex flex-col gap-1" aria-label="Main navigation">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md border px-3 py-3 transition-colors ${
                isActive
                  ? "border-slate-500 bg-slate-800 text-white"
                  : "border-transparent text-slate-300 hover:border-white/10 hover:bg-slate-800/70 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">{item.description}</p>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-md border border-white/10 bg-slate-900 px-3 py-4">
        <p className="text-sm font-medium text-white">{user?.fullName ?? "Authenticated user"}</p>
        <p className="mt-1 text-xs text-slate-400">{user?.email ?? "No active email"}</p>
        <p className="mt-3 text-xs uppercase tracking-[0.08em] text-slate-500">
          {user?.role ?? "Operational access"}
        </p>
        <FoundationButton className="mt-4 w-full" variant="secondary" onClick={logout}>
          Sign out
        </FoundationButton>
      </div>
    </aside>
  );
}
