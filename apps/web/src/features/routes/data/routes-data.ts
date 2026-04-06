export type RouteSummaryItem = {
  label: string;
  value: string;
};

export type RouteQueueItem = {
  id: string;
  customer: string;
  region: string;
  issue: string;
  scheduledWindow: string;
  technician: string;
  status: "Ready" | "Attention" | "Blocked";
};

export type RouteAttentionItem = {
  title: string;
  description: string;
  tone: "warning" | "success";
};

export const routeSummary: RouteSummaryItem[] = [
  { label: "Scheduled visits", value: "6" },
  { label: "Ready dispatches", value: "4" },
  { label: "Attention points", value: "2" },
  { label: "Blocked plans", value: "1" }
];

export const routeQueue: RouteQueueItem[] = [
  {
    id: "R-201",
    customer: "Starlight Apartments",
    region: "Metro North",
    issue: "Signal degradation follow-up",
    scheduledWindow: "08:30 - 09:30",
    technician: "Team Alpha",
    status: "Ready"
  },
  {
    id: "R-204",
    customer: "Apex Financial Hub",
    region: "Central Core",
    issue: "Expansion activation visit",
    scheduledWindow: "10:00 - 11:30",
    technician: "Team Beta",
    status: "Ready"
  },
  {
    id: "R-208",
    customer: "Miller Residence",
    region: "Suburban East",
    issue: "Outage escalation",
    scheduledWindow: "13:00 - 14:00",
    technician: "Team Field 3",
    status: "Attention"
  },
  {
    id: "R-211",
    customer: "Coastal Market",
    region: "Coastal Line",
    issue: "Install pending stock confirmation",
    scheduledWindow: "15:00 - 16:00",
    technician: "Unassigned",
    status: "Blocked"
  }
];

export const routeAttention: RouteAttentionItem[] = [
  {
    title: "Blocked planning remains out of scope",
    description:
      "FC-016 reopens only the overview. Planning, optimization and field operation stay closed until a dedicated backend-backed task exists.",
    tone: "warning"
  },
  {
    title: "Current queue is ready for operational review",
    description:
      "The screen now supports reading route load, dispatch status and next follow-up without simulating map interaction or live tracking.",
    tone: "success"
  }
];
