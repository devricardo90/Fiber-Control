import { PageHeader } from "@/components/shared/page-header";

export function MonthlyRevenueReportScreen() {
  return (
    <div className="page-shell">
      <PageHeader
        title="Monthly revenue report"
        description="Staging route for the month-by-month revenue visualization."
        badge="GET /reports/monthly-revenue"
      />

      <section className="page-grid">
        <article className="card" style={{ gridColumn: "span 12" }}>
          <h2>Ready for chart-driven UI</h2>
          <p>
            This route exists so the reports module can already branch into more specific report
            screens as the Figma assets arrive.
          </p>
        </article>
      </section>
    </div>
  );
}
