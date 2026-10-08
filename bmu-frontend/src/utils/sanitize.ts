import DOMPurify from 'dompurify';

/**
 * Sanitize HTML before rendering with dangerouslySetInnerHTML.
 * CMS-authored rich text is treated as untrusted to prevent stored XSS.
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}
