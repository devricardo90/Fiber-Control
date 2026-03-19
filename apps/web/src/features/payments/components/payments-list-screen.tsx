import { PlaceholderPage } from "@/components/shared/placeholder-page";

import { paymentHighlights, paymentsSummary } from "../data/payments-data";

export function PaymentsListScreen() {
  return (
    <PlaceholderPage
      title="Payments"
      description="Recurring billing records, payment states and monthly references."
      badge="Payments module ready"
      primaryAction={{ href: "/payments/new", label: "Register payment" }}
      secondaryAction={{ href: "/reports", label: "View payment reports" }}
      summary={paymentsSummary}
      highlights={paymentHighlights}
    />
  );
}
