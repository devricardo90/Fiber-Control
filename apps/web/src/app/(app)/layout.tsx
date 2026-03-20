import type { PropsWithChildren } from "react";
import "../globals.css";

export default function ProtectedLayout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
