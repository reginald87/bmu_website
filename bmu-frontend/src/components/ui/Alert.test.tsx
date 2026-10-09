import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert } from './Alert'
import { SkipLink } from './SkipLink'

describe('Alert', () => {
  it('announces informational content politely (role=status)', () => {
    render(<Alert variant="info">Heads up</Alert>)
    expect(screen.getByRole('status')).toHaveTextContent('Heads up')
  })

  it('announces danger content urgently (role=alert) and renders the title', () => {
    render(
      <Alert variant="danger" title="Error">
        Something broke
      </Alert>,
    )
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Something broke')
    expect(screen.getByText('Error')).toBeInTheDocument()
  })
})

describe('SkipLink', () => {
  it('links to the main-content landmark by default', () => {
    render(<SkipLink />)
    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute(
      'href',
      '#main-content',
    )
  })

  it('honours a custom target and label', () => {
    render(<SkipLink href="#content" >Jump</SkipLink>)
    expect(screen.getByRole('link', { name: 'Jump' })).toHaveAttribute('href', '#content')
  })
})
