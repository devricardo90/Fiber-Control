import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  badge?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, description, badge, actions }: PageHeaderProps) {
  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="topbar-actions">
        {badge ? <span className="badge">{badge}</span> : null}
        {actions}
      </div>
    </header>
  );
}
