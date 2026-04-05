import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";

type FieldProps = {
  label: string;
  hint?: string;
};

type TextFieldProps = FieldProps & InputHTMLAttributes<HTMLInputElement>;
type SelectFieldProps = FieldProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    options: Array<{ label: string; value: string }>;
  };
type TextareaFieldProps = FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

function FieldFrame({
  children,
  hint,
  label
}: FieldProps & {
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--fc-text-muted)]">
        {label}
      </span>
      {children}
      {hint ? <span className="text-xs text-[var(--fc-text-muted)]">{hint}</span> : null}
    </label>
  );
}

export function TextField({ hint, label, ...props }: TextFieldProps) {
  return (
    <FieldFrame label={label} hint={hint}>
      <input
        className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface)] px-3 py-2 text-sm text-[var(--fc-text)] outline-none transition-colors focus:border-[var(--fc-primary)]"
        {...props}
      />
    </FieldFrame>
  );
}

export function SelectField({ hint, label, options, ...props }: SelectFieldProps) {
  return (
    <FieldFrame label={label} hint={hint}>
      <select
        className="rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface)] px-3 py-2 text-sm text-[var(--fc-text)] outline-none transition-colors focus:border-[var(--fc-primary)]"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldFrame>
  );
}

export function TextareaField({ hint, label, ...props }: TextareaFieldProps) {
  return (
    <FieldFrame label={label} hint={hint}>
      <textarea
        className="min-h-24 rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface)] px-3 py-2 text-sm text-[var(--fc-text)] outline-none transition-colors focus:border-[var(--fc-primary)]"
        {...props}
      />
    </FieldFrame>
  );
}
