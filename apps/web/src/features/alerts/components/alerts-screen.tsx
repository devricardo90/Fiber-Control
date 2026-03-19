import { PlaceholderPage } from "@/components/shared/placeholder-page";

import { alertsHighlights, alertsSummary } from "../data/alerts-data";

export function AlertsScreen() {
  return (
    <PlaceholderPage
      title="Alerts"
      description="Operational attention points for overdue customers, cutoff windows and pending items."
      badge="Alerts overview ready"
      primaryAction={{ href: "/customers", label: "Review customers" }}
      secondaryAction={{ href: "/reports/overdue", label: "Open overdue report" }}
      summary={alertsSummary}
      highlights={alertsHighlights}
    />
  );
}
