import { PageHeader } from "@/components/shared/page-header";

import { settingsCards } from "../data/settings-data";

export function SettingsScreen() {
  return (
    <div className="page-shell">
      <PageHeader
        title="Settings"
        description="Configuration hub for tax, fiscal reminders and users."
        badge="Settings scope aligned"
      />

      <section className="page-grid">
        {settingsCards.map((card) => (
          <article key={card.title} className="card" style={{ gridColumn: "span 4" }}>
            <span className="badge">{card.badge}</span>
            <h2 style={{ marginTop: 22 }}>{card.title}</h2>
            <p>{card.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
