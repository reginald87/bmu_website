import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('drops falsy values', () => {
    expect(cn('a', undefined, null, false, 'c')).toBe('a c')
    expect(cn('a', undefined, undefined, 'c')).toBe('a c')
  })

  it('resolves conflicting Tailwind utilities in favour of the last one', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
    expect(cn('text-primary-600', 'text-ink-900')).toBe('text-ink-900')
  })

  it('supports conditional object syntax via clsx', () => {
    expect(cn('base', { active: true, hidden: false })).toBe('base active')
  })
})
