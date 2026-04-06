import { DataTable } from "@/components/foundation/data-table";
import { Panel } from "@/components/foundation/panel";
import { StatusChip } from "@/components/foundation/status-chip";
import { PageHeader } from "@/components/shared/page-header";
import { apiBoundary } from "@/lib/api-boundary";
import { appConfig } from "@/lib/config";

const environmentRows = [
  ["APP", appConfig.appUrl, "Local frontend"],
  ["API", apiBoundary.baseUrl, "Backend boundary"],
  ["AUTH", apiBoundary.authStorageKey, "Browser token key"]
];

export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings"
        description="System-level baseline kept intentionally small during frontend foundation."
        badge={<StatusChip label="No business settings opened" tone="warning" />}
      />

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Panel title="Scope boundary" description="What remains closed after FC-007.">
          <ul className="space-y-2 text-sm text-[var(--fc-text-soft)]">
            <li>Customer forms remain outside current scope.</li>
            <li>Payment flows remain outside current scope.</li>
            <li>Alert handling remains outside current scope.</li>
            <li>Reconciliation and fiscal screens remain outside current scope.</li>
          </ul>
        </Panel>

        <Panel
          title="Operational notes"
          description="Constraints that future UI tasks must preserve."
        >
          <div className="flex flex-wrap gap-2">
            <StatusChip label="No shadcn base" tone="success" />
            <StatusChip label="Tailwind primitives" tone="success" />
            <StatusChip label="Operational density" tone="info" />
            <StatusChip label="Marketing blocks blocked" tone="danger" />
          </div>
        </Panel>
      </section>

      <Panel
        title="Environment baseline"
        description="Frontend runtime values to support future API integration."
      >
        <DataTable columns={["Key", "Value", "Reading"]} rows={environmentRows} />
      </Panel>
    </div>
  );
}
