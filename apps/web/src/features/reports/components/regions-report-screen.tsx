import { PageHeader } from "@/components/shared/page-header";

export function RegionsReportScreen() {
  return (
    <div className="page-shell">
      <PageHeader
        title="Regional report"
        description="Staging route for the detailed region performance report."
        badge="GET /reports/regions"
      />

      <section className="page-grid">
        <article className="card" style={{ gridColumn: "span 12" }}>
          <h2>Report route scaffolded</h2>
          <p>
            This route is available for the eventual region report screen or drilldown table from
            Figma.
          </p>
        </article>
      </section>
    </div>
  );
}
