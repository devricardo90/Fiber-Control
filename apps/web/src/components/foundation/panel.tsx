import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type PanelProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  description?: string;
  headerAction?: ReactNode;
};

export function Panel({
  children,
  className,
  description,
  headerAction,
  title,
  ...props
}: PanelProps) {
  return (
    <section
      className={cn(
        "rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface)] p-5",
        className
      )}
      {...props}
    >
      {title || description || headerAction ? (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title ? <h2 className="text-sm font-semibold text-[var(--fc-text)]">{title}</h2> : null}
            {description ? (
              <p className="mt-1 text-sm text-[var(--fc-text-soft)]">{description}</p>
            ) : null}
          </div>
          {headerAction}
        </header>
      ) : null}
      {children}
    </section>
  );
}
