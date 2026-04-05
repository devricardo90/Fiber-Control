import { cn } from "@/lib/utils";

type StatusChipProps = {
  label: string;
  tone?: "neutral" | "info" | "success" | "warning" | "danger";
};

const toneClassNames: Record<NonNullable<StatusChipProps["tone"]>, string> = {
  neutral: "border-[var(--fc-border)] bg-[var(--fc-surface-muted)] text-[var(--fc-text-soft)]",
  info: "border-[#b7cfde] bg-[var(--fc-primary-soft)] text-[var(--fc-primary)]",
  success: "border-[#bbdbc9] bg-[var(--fc-success-soft)] text-[var(--fc-success)]",
  warning: "border-[#ebd8b4] bg-[var(--fc-warning-soft)] text-[var(--fc-warning)]",
  danger: "border-[#edc0c0] bg-[var(--fc-danger-soft)] text-[var(--fc-danger)]"
};

export function StatusChip({ label, tone = "neutral" }: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        toneClassNames[tone]
      )}
    >
      {label}
    </span>
  );
}
