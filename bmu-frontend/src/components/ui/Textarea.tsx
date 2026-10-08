import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, invalid = false, rows = 4, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid || undefined}
        className={cn(
          "flex w-full border bg-white px-3.5 py-2.5 text-base text-ink-900",
          "placeholder:text-ink-400 transition-colors",
          "focus-visible:border-primary-600 focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:bg-ink-50 disabled:opacity-60",
          invalid ? "border-danger" : "border-ink-200",
          className,
        )}
        {...props}
      />
    );
  },
);
