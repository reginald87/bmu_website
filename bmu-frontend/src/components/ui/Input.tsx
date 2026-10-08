import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Marks the field invalid and sets aria-invalid for assistive tech. */
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid = false, type = "text", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        "flex h-11 w-full border bg-white px-3.5 py-2 text-base text-ink-900",
        "placeholder:text-ink-400 transition-colors",
        "focus-visible:border-primary-600",
        "disabled:cursor-not-allowed disabled:bg-ink-50 disabled:opacity-60",
        invalid ? "border-danger" : "border-ink-200",
        className,
      )}
      {...props}
    />
  );
});
