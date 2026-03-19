import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";

type CustomerDetailsScreenProps = {
  customerId: string;
};

export function CustomerDetailsScreen({ customerId }: CustomerDetailsScreenProps) {
  return (
    <div className="page-shell">
      <PageHeader
        title="Customer details"
        description={`Customer route scaffolded for id ${customerId}.`}
        badge="Detail flow ready"
        actions={
          <div className="cta-row">
            <Link href={`/customers/${customerId}/edit`} className="button-primary">
              Edit customer
            </Link>
            <Link href="/payments/new" className="button-secondary">
              Register payment
            </Link>
          </div>
        }
      />

      <section className="page-grid">
        <article className="card" style={{ gridColumn: "span 8" }}>
          <h2>Reserved for Figma detail screen</h2>
          <p>
            This page will host the final customer detail layout, including billing profile,
            payment history and region context.
          </p>
          <table className="table">
            <tbody>
              <tr>
                <th>Route param</th>
                <td>{customerId}</td>
              </tr>
              <tr>
                <th>Backend endpoint</th>
                <td>GET /customers/:id</td>
              </tr>
              <tr>
                <th>Suggested sections</th>
                <td>Profile, billing rules, payments, status timeline</td>
              </tr>
            </tbody>
          </table>
        </article>

        <article className="card list-card" style={{ gridColumn: "span 4" }}>
          <h2>Planned actions</h2>
          <div className="list-item">
            <div>
              <strong>Edit customer</strong>
              <span>Use the existing update contract.</span>
            </div>
            <span className="status-pill" data-tone="info">
              available
            </span>
          </div>
          <div className="list-item">
            <div>
              <strong>Manual status recalculation</strong>
              <span>Can be exposed as an advanced action.</span>
            </div>
            <span className="status-pill" data-tone="warning">
              optional
            </span>
          </div>
        </article>
      </section>
    </div>
  );
}
