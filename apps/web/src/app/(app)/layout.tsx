"use client";

import type { PropsWithChildren } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppStatusBanner } from "@/components/layout/app-status-banner";

export default function ProtectedLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[var(--fc-bg)] lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <AppSidebar />
      <div className="min-w-0">
        <AppHeader />
        <main className="px-4 py-5 sm:px-6">
          <AppStatusBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
