import { PageHeader } from "@/components/shared/page-header";

import { customerFormSections } from "../data/customers-data";

export function CustomerCreateScreen() {
  return (
    <div className="page-shell">
      <PageHeader
        title="Create customer"
        description="Staging route for the create/edit customer form."
        badge="Form flow ready"
      />

      <section className="page-grid">
        <article className="card" style={{ gridColumn: "span 8" }}>
          <h2>Form structure planned</h2>
          <p>
            This route is reserved for the final form screen from Figma. The backend already
            supports create and update rules, including validation for region, monthly fee and due
            rules.
          </p>
          <div className="list-card" style={{ marginTop: 18 }}>
            {customerFormSections.map((section) => (
              <div key={section} className="list-item">
                <div>
                  <strong>{section}</strong>
                  <span>Ready to be translated into actual inputs and sections.</span>
                </div>
                <span className="status-pill" data-tone="info">
                  pending ui
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="card" style={{ gridColumn: "span 4" }}>
          <h2>Backend contract</h2>
          <p>
            Supported fields include name, phone, address, region, monthly fee, due day, grace
            days and cutoff days.
          </p>
          <div className="cta-row">
            <span className="badge">POST /customers</span>
            <span className="badge">PATCH /customers/:id</span>
          </div>
        </article>
      </section>
    </div>
  );
}
