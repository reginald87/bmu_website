import { cn } from "../../lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "link";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors duration-200 select-none disabled:pointer-events-none disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800",
  secondary: "bg-ink-900 text-white hover:bg-ink-800 active:bg-ink-950",
  outline:
    "border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white",
  ghost: "text-ink-700 hover:bg-ink-100",
  danger: "bg-danger text-white hover:bg-red-800 active:bg-red-900",
  link: "text-primary-600 underline-offset-4 hover:underline p-0 h-auto",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-12 px-7 text-lg",
  icon: "h-10 w-10",
};

export interface ButtonVariantOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/** Class generator for rendering non-<button> elements (e.g. react-router <Link>). */
export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: ButtonVariantOptions = {}): string {
  return cn(base, variantClasses[variant], sizeClasses[size], className);
}
