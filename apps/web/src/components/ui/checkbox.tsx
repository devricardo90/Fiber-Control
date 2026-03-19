import * as React from "react";

import { cn } from "@/lib/utils";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          "h-[18px] w-[18px] rounded border border-[var(--border-strong)] bg-transparent accent-[var(--secondary)]",
          className
        )}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";
