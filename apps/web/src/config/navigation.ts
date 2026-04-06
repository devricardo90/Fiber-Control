import type { LucideIcon } from "lucide-react";
import {
  Bell,
  ChartColumn,
  CreditCard,
  FileText,
  LayoutGrid,
  MapPinned,
  Settings2,
  TableProperties,
  Users
} from "lucide-react";

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
    href: "/customers",
    label: "Customers",
    description: "First reopened business surface.",
    icon: Users
  },
  {
    href: "/payments",
    label: "Payments",
    description: "Second reopened business surface.",
    icon: CreditCard
  },
  {
    href: "/alerts",
    label: "Alerts",
    description: "Read-only operational alert overview.",
    icon: Bell
  },
  {
    href: "/finance",
    label: "Finance",
    description: "Read-only financial overview.",
    icon: ChartColumn
  },
  {
    href: "/reports",
    label: "Reports",
    description: "Operational overview across revenue, overdue and regions.",
    icon: FileText
  },
  {
    href: "/regions",
    label: "Regions",
    description: "Regional performance and collection overview.",
    icon: MapPinned
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Environment and session baseline.",
    icon: Settings2
  }
];
