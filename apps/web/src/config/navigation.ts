import type { LucideIcon } from "lucide-react";
import {
  Bell,
  ChartColumnBig,
  LayoutDashboard,
  Map,
  MapPinned,
  ReceiptText,
  Settings,
  Users
} from "lucide-react";

export const navigationItems: Array<{
  href: string;
  label: string;
  icon: LucideIcon;
}> = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/payments", label: "Payments", icon: ReceiptText },
  { href: "/finance", label: "Finance", icon: ChartColumnBig },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/regions", label: "Regions", icon: MapPinned },
  { href: "/routes", label: "Routes", icon: Map },
  { href: "/reports", label: "Reports", icon: ChartColumnBig },
  { href: "/settings", label: "Settings", icon: Settings }
];
