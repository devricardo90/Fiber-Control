import { PageHeader } from "@/components/shared/page-header";

import { registerPaymentSections } from "../data/payments-data";

export function RegisterPaymentScreen() {
  return (
    <div className="page-shell">
      <PageHeader
        title="Register payment"
        description="Route prepared for the payment registration screen from Figma."
        badge="POST /payments"
      />

      <section className="page-grid">
        <article className="card" style={{ gridColumn: "span 8" }}>
          <h2>Expected form payload</h2>
          <p>
            Customer, reference month, expected amount, received amount and payment notes can be
            represented here. The backend already derives payment status from the values.
          </p>
        </article>

        <article className="card" style={{ gridColumn: "span 4" }}>
          <h2>Suggested UX</h2>
          <div className="list-card">
            {registerPaymentSections.map((section) => (
              <div key={section.title} className="list-item">
                <div>
                  <strong>{section.title}</strong>
                  <span>{section.description}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
