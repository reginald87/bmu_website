import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

/** Max-width centered page container with responsive gutters (mirrors `.container-custom`). */
export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("container-custom", className)} {...props} />;
}
