"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigationItems } from "@/config/navigation";

import { useAuth } from "./auth-provider";

export function AppSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="app-sidebar">
      <div className="brand-block">
        <span className="brand-title">FiberControl</span>
        <span className="brand-line" />
      </div>

      <div>
        <p className="sidebar-section-title">Operations</p>
        <nav className="nav-list" aria-label="Main navigation">
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? "nav-link-active" : ""}`.trim()}
              >
                <span className="nav-icon" aria-hidden="true">
                  <Icon size={18} strokeWidth={2.1} />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <strong>{user?.fullName ?? "Authenticated user"}</strong>
        <p>
          {user?.role === "admin" ? "Administrator access" : "Operational access"}
          <br />
          {user?.email ?? "No email available"}
        </p>
        <button type="button" onClick={logout}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
