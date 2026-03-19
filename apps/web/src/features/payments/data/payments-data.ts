export const paymentsSummary = [
  { label: "Expected this month", value: "R$ 24.800,00" },
  { label: "Received", value: "R$ 18.450,00" },
  { label: "Pending", value: "R$ 4.930,00" },
  { label: "Partial", value: "R$ 1.420,00" }
];

export const paymentHighlights = [
  {
    title: "Backend supports create and list",
    description: "The first UI can focus on listing, filters and register payment flow.",
    tone: "success" as const
  },
  {
    title: "Reconciliation exists separately",
    description: "Manual bank matching can later become a secondary UI inside finance/payments.",
    tone: "info" as const
  },
  {
    title: "Next handoff expected",
    description: "Main payments board or month-based table from Figma.",
    tone: "warning" as const
  }
];

export const registerPaymentSections = [
  {
    title: "Select customer",
    description: "Searchable customer input."
  },
  {
    title: "Reference month",
    description: "Month picker or compact period field."
  },
  {
    title: "Received amount",
    description: "Status should preview as pending, partial or paid."
  }
];
