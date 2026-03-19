import { PageHeader } from "@/components/shared/page-header";

type CustomerEditScreenProps = {
  customerId: string;
};

export function CustomerEditScreen({ customerId }: CustomerEditScreenProps) {
  return (
    <div className="page-shell">
      <PageHeader
        title="Edit customer"
        description={`Edit flow scaffolded for customer ${customerId}.`}
        badge="PATCH /customers/:id"
      />

      <section className="page-grid">
        <article className="card" style={{ gridColumn: "span 12" }}>
          <h2>Form target ready</h2>
          <p>
            This route is ready for the dedicated edit screen from Figma. It should reuse the same
            structural fields as the create screen, with status display and safe update actions.
          </p>
        </article>
      </section>
    </div>
  );
}
