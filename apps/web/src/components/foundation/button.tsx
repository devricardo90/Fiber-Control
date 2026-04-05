import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type FoundationButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variantClassNames: Record<NonNullable<FoundationButtonProps["variant"]>, string> = {
  primary:
    "border border-[var(--fc-primary)] bg-[var(--fc-primary)] text-white hover:bg-[#0d416e]",
  secondary:
    "border border-[var(--fc-border-strong)] bg-[var(--fc-surface)] text-[var(--fc-text)] hover:bg-[var(--fc-surface-muted)]",
  ghost:
    "border border-transparent bg-transparent text-[var(--fc-text-soft)] hover:bg-[var(--fc-surface-muted)] hover:text-[var(--fc-text)]"
};

export function FoundationButton({
  className,
  type = "button",
  variant = "secondary",
  ...props
}: FoundationButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variantClassNames[variant],
        className
      )}
      {...props}
    />
  );
}
