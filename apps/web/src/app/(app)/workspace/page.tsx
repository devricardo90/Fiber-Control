import { DataTable } from "@/components/foundation/data-table";
import { Panel } from "@/components/foundation/panel";
import { StatusChip } from "@/components/foundation/status-chip";
import { PageHeader } from "@/components/shared/page-header";
import { apiBoundary } from "@/lib/api-boundary";

const checklistRows = [
  ["Layout shell", "Sidebar + header + session banner", "Ready"],
  ["Navigation", "Restricted to foundation routes", "Ready"],
  ["API boundary", "Base URL and initial contract", "Ready"],
  ["Business screens", "Held outside FC-007 scope", "Blocked by scope"]
];

export default function WorkspacePage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Workspace"
        description="Operational shell and first frontend boundary for Fiber Control."
        badge={<StatusChip label="FC-007 foundation" tone="info" />}
      />

      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Panel
          title="Foundation baseline"
          description="This screen closes the shell without opening any business workflow."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface-muted)] p-4">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
                Visual rule
              </p>
              <p className="mt-2 text-sm text-[var(--fc-text)]">
                Operation wins over marketing aesthetics.
              </p>
            </div>
            <div className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface-muted)] p-4">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
                Base stack
              </p>
              <p className="mt-2 text-sm text-[var(--fc-text)]">
                Next.js + React + Tailwind + own primitives.
              </p>
            </div>
            <div className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface-muted)] p-4">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
                Navigation mode
              </p>
              <p className="mt-2 text-sm text-[var(--fc-text)]">
                Single shell for future operational modules.
              </p>
            </div>
            <div className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface-muted)] p-4">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
                Current limit
              </p>
              <p className="mt-2 text-sm text-[var(--fc-text)]">
                No customer, payment or alert screen is opened here.
              </p>
            </div>
          </div>
        </Panel>

        <Panel
          title="API boundary"
          description="Initial contract to support future UI without improvisation."
        >
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-medium text-[var(--fc-text)]">Base URL</dt>
              <dd className="mt-1 text-[var(--fc-text-soft)]">{apiBoundary.baseUrl}</dd>
            </div>
            <div>
              <dt className="font-medium text-[var(--fc-text)]">Auth storage key</dt>
              <dd className="mt-1 text-[var(--fc-text-soft)]">{apiBoundary.authStorageKey}</dd>
            </div>
            <div>
              <dt className="font-medium text-[var(--fc-text)]">First routes</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {apiBoundary.routes.map((route) => (
                  <StatusChip
                    key={`${route.method}-${route.path}`}
                    label={`${route.method} ${route.path}`}
                    tone="neutral"
                  />
                ))}
              </dd>
            </div>
          </dl>
        </Panel>
      </section>

      <Panel
        title="Operational readiness"
        description="Checklist of what FC-007 closes before any business screen starts."
      >
        <DataTable columns={["Area", "Reading", "Status"]} rows={checklistRows} />
      </Panel>
    </div>
  );
}
