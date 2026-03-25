"use client";

import type { PropsWithChildren } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppStatusBanner } from "@/components/layout/app-status-banner";
import "../globals.css";

export default function ProtectedLayout({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <AppSidebar />
      <AppHeader />
      <main className="app-main">
        <AppStatusBanner />
        {children}
      </main>
    </div>
  );
}
