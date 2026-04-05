import Link from "next/link";

import { FoundationButton } from "@/components/foundation/button";
import { Panel } from "@/components/foundation/panel";
import { StatusChip } from "@/components/foundation/status-chip";

import { PageHeader } from "./page-header";

type PlaceholderPageProps = {
  title: string;
  description: string;
  badge?: string;
  primaryAction?: {
    href: string;
    label: string;
  };
  secondaryAction?: {
    href: string;
    label: string;
  };
  summary: Array<{
    label: string;
    value: string;
  }>;
  highlights: Array<{
    title: string;
    description: string;
    tone: "success" | "warning" | "danger" | "info";
  }>;
};

export function PlaceholderPage({
  badge,
  description,
  highlights,
  primaryAction,
  secondaryAction,
  summary,
  title
}: PlaceholderPageProps) {
  return (
    <div className="space-y-5">
      <PageHeader
        title={title}
        description={description}
        badge={badge ? <StatusChip label={badge} tone="info" /> : null}
        actions={
          <>
            {secondaryAction ? (
              <Link href={secondaryAction.href}>
                <FoundationButton variant="secondary">{secondaryAction.label}</FoundationButton>
              </Link>
            ) : null}
            {primaryAction ? (
              <Link href={primaryAction.href}>
                <FoundationButton variant="primary">{primaryAction.label}</FoundationButton>
              </Link>
            ) : null}
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Panel key={item.label}>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
              {item.label}
            </p>
            <p className="mt-3 text-2xl font-semibold text-[var(--fc-text)]">{item.value}</p>
          </Panel>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Panel
          title="Frontend foundation only"
          description="This route is intentionally held as a placeholder until the matching operational flow is explicitly opened in backlog."
        >
          <p className="text-sm leading-6 text-[var(--fc-text-soft)]">
            FC-007 closes the shell, navigation, primitives and API boundary. Full business screens
            remain outside scope and should only be opened by dedicated READY tasks.
          </p>
        </Panel>

        <Panel title="Current status" description="Operational reading of this route.">
          <div className="flex flex-col gap-2">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface-muted)] p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-sm text-[var(--fc-text)]">{item.title}</strong>
                  <StatusChip label={item.tone} tone={item.tone} />
                </div>
                <p className="mt-2 text-sm text-[var(--fc-text-soft)]">{item.description}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}
