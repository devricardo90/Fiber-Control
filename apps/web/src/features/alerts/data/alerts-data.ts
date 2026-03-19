export const alertsSummary = [
  { label: "Total alerts", value: "12" },
  { label: "Overdue", value: "6" },
  { label: "Cutoff soon", value: "3" },
  { label: "Pending payment", value: "3" }
];

export const alertsHighlights = [
  {
    title: "Alerts are already calculated by backend",
    description: "The frontend screen only needs the visual grouping and filtering logic.",
    tone: "success" as const
  },
  {
    title: "Good candidate for urgency colors",
    description: "This page should emphasize severity and next action clearly.",
    tone: "danger" as const
  },
  {
    title: "Next handoff expected",
    description: "Alerts board or feed layout from Figma.",
    tone: "warning" as const
  }
];
