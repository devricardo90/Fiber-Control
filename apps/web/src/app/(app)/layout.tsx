import type { PropsWithChildren } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";

export default function ProtectedLayout({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <AppSidebar />
      <main className="app-main">{children}</main>
    </div>
  );
}
