import { PlaceholderPage } from "@/components/shared/placeholder-page";

import { reportsHighlights, reportsSummary } from "../data/reports-data";

export function ReportsScreen() {
  return (
    <PlaceholderPage
      title="Reports"
      description="Monthly revenue, annual summary, overdue, regional and customer reports."
      badge="Reporting module ready"
      primaryAction={{ href: "/reports/monthly-revenue", label: "Monthly revenue" }}
      secondaryAction={{ href: "/reports/overdue", label: "Overdue report" }}
      summary={reportsSummary}
      highlights={reportsHighlights}
    />
  );
}
