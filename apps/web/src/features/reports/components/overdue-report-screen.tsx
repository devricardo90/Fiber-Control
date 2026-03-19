import { PageHeader } from "@/components/shared/page-header";

export function OverdueReportScreen() {
  return (
    <div className="page-shell">
      <PageHeader
        title="Overdue report"
        description="Staging route for the overdue customer and outstanding debt report."
        badge="GET /reports/overdue"
      />

      <section className="page-grid">
        <article className="card" style={{ gridColumn: "span 12" }}>
          <h2>Ready for list or report layout</h2>
          <p>
            Use this route when the overdue report screen arrives from Figma. The backend already
            exposes the dataset needed for this view.
          </p>
        </article>
      </section>
    </div>
  );
}
