import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  badge?: ReactNode;
  actions?: ReactNode;
};

export function PageHeader({ actions, badge, description, title }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-3 border-b border-[var(--fc-border)] pb-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-[var(--fc-text)]">{title}</h1>
        <p className="mt-1 text-sm text-[var(--fc-text-soft)]">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {badge}
        {actions}
      </div>
    </header>
  );
}
