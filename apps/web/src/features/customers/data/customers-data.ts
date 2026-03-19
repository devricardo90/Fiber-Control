export const customersSummary = [
  { label: "Total customers", value: "184" },
  { label: "Active", value: "156" },
  { label: "Overdue", value: "18" },
  { label: "Suspended", value: "10" }
];

export const customerHighlights = [
  {
    title: "Detail and edit flows are already mapped",
    description: "Use the secondary routes as the base for the Figma screens.",
    tone: "info" as const
  },
  {
    title: "Status rules already exist in backend",
    description: "Frontend only needs to express the states clearly in the table and details.",
    tone: "success" as const
  },
  {
    title: "Next handoff expected",
    description: "Main customer listing screen with filters and row actions.",
    tone: "warning" as const
  }
];

export const customerFormSections = [
  "Personal and contact data",
  "Address and region",
  "Contract values and due rules",
  "Notes and service context"
];
