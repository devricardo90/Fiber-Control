export const financeSummary = [
  { label: "Received this month", value: "R$ 18.450,00" },
  { label: "Expected revenue", value: "R$ 24.800,00" },
  { label: "Outstanding", value: "R$ 6.350,00" },
  { label: "Overdue", value: "R$ 3.280,00" }
];

export const financeHighlights = [
  {
    title: "Finance endpoint already exists",
    description: "GET /finance/overview can power the first real cards immediately.",
    tone: "success" as const
  },
  {
    title: "Tax config is already available",
    description: "You can fold fiscal estimate widgets into this page later if desired.",
    tone: "info" as const
  },
  {
    title: "Next handoff expected",
    description: "Financial summary screen from Figma with cards and trend visuals.",
    tone: "warning" as const
  }
];
