import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppProviders } from "@/components/layout/app-providers";
import { appConfig } from "@/lib/config";

import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: `${appConfig.appName} | Operations`,
  description: "Operational control panel for recurring-service providers."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
