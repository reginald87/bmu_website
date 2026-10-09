import { describe, expect, it } from 'vitest'
import { sanitizeHtml } from './sanitize'

describe('sanitizeHtml', () => {
  it('returns an empty string for nullish or empty input', () => {
    expect(sanitizeHtml(null)).toBe('')
    expect(sanitizeHtml(undefined)).toBe('')
    expect(sanitizeHtml('')).toBe('')
  })

  it('preserves safe markup', () => {
    expect(sanitizeHtml('<p>Hello <strong>world</strong></p>')).toBe(
      '<p>Hello <strong>world</strong></p>',
    )
  })

  it('strips <script> tags', () => {
    const output = sanitizeHtml('<p>ok</p><script>alert(1)</script>')
    expect(output).toContain('<p>ok</p>')
    expect(output).not.toContain('<script')
  })

  it('strips inline event handlers', () => {
    const output = sanitizeHtml('<img src="x" onerror="alert(1)">')
    expect(output).not.toContain('onerror')
  })

  it('removes javascript: URLs', () => {
    const output = sanitizeHtml('<a href="javascript:alert(1)">click</a>')
    expect(output).not.toContain('javascript:')
  })
})
