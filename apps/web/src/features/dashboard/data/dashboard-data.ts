import { Activity, AlertTriangle, CircleDollarSign, TrendingUp } from "lucide-react";

import { formatCurrency } from "@/lib/format";

export const dashboardMetrics = [
  { label: "Monthly revenue", value: formatCurrency(18450), icon: CircleDollarSign },
  { label: "Overdue amount", value: formatCurrency(3280), icon: AlertTriangle },
  { label: "Active customers", value: "184", icon: Activity },
  { label: "Pending alerts", value: "12", icon: TrendingUp }
];

export const collectionTrend = [
  { month: "Jan", expected: 18000, received: 17200 },
  { month: "Feb", expected: 19200, received: 18400 },
  { month: "Mar", expected: 24800, received: 18450 },
  { month: "Apr", expected: 25100, received: 19700 }
];

export const fieldAttentionCustomers = [
  { name: "Ana Martins", region: "North Route", status: "active", tone: "success" as const },
  { name: "Bruno Alves", region: "Central Route", status: "overdue", tone: "warning" as const },
  { name: "Carla Souza", region: "South Route", status: "suspended", tone: "danger" as const }
];

export const dashboardActions = [
  { href: "/customers/new", label: "New customer" },
  { href: "/payments/new", label: "Register payment" },
  { href: "/reports", label: "Open reports" }
];
