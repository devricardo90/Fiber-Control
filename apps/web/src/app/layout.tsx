import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppProviders } from "@/components/layout/app-providers";
import { appConfig } from "@/lib/config";

import "./globals.css";

export const metadata: Metadata = {
  title: `${appConfig.appName} | Frontend Base`,
  description: "Operational frontend foundation for Fiber Control."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
