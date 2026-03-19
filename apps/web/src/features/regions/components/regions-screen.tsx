import { PlaceholderPage } from "@/components/shared/placeholder-page";

import { regionsHighlights, regionsSummary } from "../data/regions-data";

export function RegionsScreen() {
  return (
    <PlaceholderPage
      title="Regions"
      description="Regional customer distribution, collection rate and outstanding concentration."
      badge="Regional performance ready"
      primaryAction={{ href: "/customers", label: "Open customer map" }}
      secondaryAction={{ href: "/reports/regions", label: "Regional report" }}
      summary={regionsSummary}
      highlights={regionsHighlights}
    />
  );
}
