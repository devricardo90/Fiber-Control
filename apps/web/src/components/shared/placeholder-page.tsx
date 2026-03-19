import Link from "next/link";

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
  title,
  description,
  badge,
  primaryAction,
  secondaryAction,
  summary,
  highlights
}: PlaceholderPageProps) {
  return (
    <div className="page-shell">
      <PageHeader
        title={title}
        description={description}
        badge={badge}
        actions={
          <div className="cta-row">
            {secondaryAction ? (
              <Link href={secondaryAction.href} className="button-secondary">
                {secondaryAction.label}
              </Link>
            ) : null}
            {primaryAction ? (
              <Link href={primaryAction.href} className="button-primary">
                {primaryAction.label}
              </Link>
            ) : null}
          </div>
        }
      />

      <section className="page-grid">
        {summary.map((item) => (
          <article key={item.label} className="card metric-card" style={{ gridColumn: "span 3" }}>
            <span className="metric-label">{item.label}</span>
            <div className="metric-value">{item.value}</div>
          </article>
        ))}
      </section>

      <section className="page-grid">
        <article className="card" style={{ gridColumn: "span 7" }}>
          <h2>Frontend staging area</h2>
          <p>
            Esta página já está integrada ao shell real do produto. Quando você enviar o layout do
            Figma correspondente, eu substituo esse conteúdo mantendo rota, autenticação e
            navegação.
          </p>
          <div className="empty-state">
            <span className="badge">Ready for Figma handoff</span>
            <p>
              O backend necessário para este módulo já existe. Falta agora encaixar a UI final,
              filtros, tabelas e interações visuais.
            </p>
          </div>
        </article>

        <article className="card list-card" style={{ gridColumn: "span 5" }}>
          <h2>Priority highlights</h2>
          {highlights.map((item) => (
            <div key={item.title} className="list-item">
              <div>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </div>
              <span className="status-pill" data-tone={item.tone}>
                {item.tone}
              </span>
            </div>
          ))}
        </article>
      </section>
    </div>
  );
}
