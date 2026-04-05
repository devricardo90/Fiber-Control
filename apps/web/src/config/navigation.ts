import type { LucideIcon } from "lucide-react";
import { LayoutGrid, Settings2, TableProperties } from "lucide-react";

export const navigationItems: Array<{
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    href: "/workspace",
    label: "Workspace",
    description: "Operational shell and integration boundary.",
    icon: LayoutGrid
  },
  {
    href: "/patterns",
    label: "Patterns",
    description: "Tables, filters and form primitives.",
    icon: TableProperties
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Environment and session baseline.",
    icon: Settings2
  }
];
