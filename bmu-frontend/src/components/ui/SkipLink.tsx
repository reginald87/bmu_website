import type { ReactNode } from "react";

interface SkipLinkProps {
  href?: string;
  children?: ReactNode;
}

/** Keyboard-only "skip to content" link. Render once, first in the app shell. */
export function SkipLink({
  href = "#main-content",
  children = "Skip to main content",
}: SkipLinkProps) {
  return (
    <a href={href} className="skip-link">
      {children}
    </a>
  );
}
