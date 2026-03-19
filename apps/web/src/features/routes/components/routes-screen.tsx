import { PlaceholderPage } from "@/components/shared/placeholder-page";

import { routesHighlights, routesSummary } from "../data/routes-data";

export function RoutesScreen() {
  return (
    <PlaceholderPage
      title="Routes"
      description="Field planning route already reserved in the frontend architecture."
      badge="UI route ready"
      primaryAction={{ href: "/customers", label: "Review customers" }}
      secondaryAction={{ href: "/regions", label: "Open regions" }}
      summary={routesSummary}
      highlights={routesHighlights}
    />
  );
}
