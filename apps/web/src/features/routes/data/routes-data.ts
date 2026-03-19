export const routesSummary = [
  { label: "Priority visits", value: "12" },
  { label: "Overdue clusters", value: "4" },
  { label: "Regional groups", value: "3" },
  { label: "Backend status", value: "Pending" }
];

export const routesHighlights = [
  {
    title: "Frontend route already preserved",
    description: "This keeps the information architecture stable even before the backend module exists.",
    tone: "info" as const
  },
  {
    title: "Good candidate for map or checklist UI",
    description: "The final screen can evolve from region grouping into operational route planning.",
    tone: "warning" as const
  },
  {
    title: "Backend dependency still pending",
    description: "Current product supports region analytics, not route planning logic yet.",
    tone: "danger" as const
  }
];
