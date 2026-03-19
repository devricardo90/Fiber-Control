import { PlaceholderPage } from "@/components/shared/placeholder-page";

import { financeHighlights, financeSummary } from "../data/finance-data";

export function FinanceOverviewScreen() {
  return (
    <PlaceholderPage
      title="Finance"
      description="Overview of monthly revenue, outstanding values and overdue exposure."
      badge="Finance overview ready"
      primaryAction={{ href: "/reports", label: "Open reports" }}
      secondaryAction={{ href: "/settings", label: "Tax & fiscal settings" }}
      summary={financeSummary}
      highlights={financeHighlights}
    />
  );
}
