import { PlaceholderPage } from "@/components/shared/placeholder-page";

import { customerHighlights, customersSummary } from "../data/customers-data";

export function CustomersListScreen() {
  return (
    <PlaceholderPage
      title="Customers"
      description="Customer portfolio, service status and account lifecycle."
      badge="Customer module ready"
      primaryAction={{ href: "/customers/new", label: "Create customer" }}
      secondaryAction={{ href: "/customers/customer-seed-001", label: "Open details" }}
      summary={customersSummary}
      highlights={customerHighlights}
    />
  );
}
