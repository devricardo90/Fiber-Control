"use client";

import type { PropsWithChildren } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import "../globals.css";

export default function ProtectedLayout({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <AppSidebar />
      <AppHeader />
      <main className="app-main">
        {children}
      </main>
    </div>
  );
}
