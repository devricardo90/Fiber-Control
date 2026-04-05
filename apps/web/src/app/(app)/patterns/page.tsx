import { FoundationButton } from "@/components/foundation/button";
import { DataTable } from "@/components/foundation/data-table";
import { SelectField, TextField, TextareaField } from "@/components/foundation/field";
import { Panel } from "@/components/foundation/panel";
import { StatusChip } from "@/components/foundation/status-chip";
import { PageHeader } from "@/components/shared/page-header";

const patternRows = [
  ["Status chip", "Compact state reading", "Used"],
  ["Data table", "Dense operational listing", "Used"],
  ["Form field", "Direct input without decoration", "Used"],
  ["Primary button", "Single clear action", "Used"]
];

export default function PatternsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Patterns"
        description="Reference primitives for filters, forms, status and dense reading."
        badge={<StatusChip label="Tailwind + own components" tone="success" />}
      />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Panel title="Filters and actions" description="Minimal controls for operational workflows.">
          <div className="grid gap-4 md:grid-cols-3">
            <TextField label="Search" placeholder="Filter by identifier" />
            <SelectField
              label="State"
              defaultValue="all"
              options={[
                { label: "All", value: "all" },
                { label: "Pending", value: "pending" },
                { label: "Resolved", value: "resolved" }
              ]}
            />
            <SelectField
              label="Period"
              defaultValue="current"
              options={[
                { label: "Current month", value: "current" },
                { label: "Previous month", value: "previous" }
              ]}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <FoundationButton variant="primary">Apply filters</FoundationButton>
            <FoundationButton variant="secondary">Reset</FoundationButton>
            <FoundationButton variant="ghost">Export selection</FoundationButton>
          </div>
        </Panel>

        <Panel title="Status language" description="No decorative badges. Only operational meaning.">
          <div className="flex flex-wrap gap-2">
            <StatusChip label="Connected" tone="info" />
            <StatusChip label="Ready" tone="success" />
            <StatusChip label="Needs review" tone="warning" />
            <StatusChip label="Blocked" tone="danger" />
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Table sample" description="Foundation for lists, queues and ledgers.">
          <DataTable columns={["Column", "Purpose", "State"]} rows={patternRows} />
        </Panel>

        <Panel title="Form sample" description="Straight inputs with no marketing framing.">
          <div className="space-y-4">
            <TextField label="Record name" placeholder="Ex. Monthly billing cycle" />
            <TextareaField
              label="Operational note"
              placeholder="Short internal context for future screen implementation."
            />
          </div>
        </Panel>
      </section>
    </div>
  );
}
