import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LoadingDots } from './LoadingDots';

describe('LoadingDots', () => {
  it('renders three dots', () => {
    const { container } = render(<LoadingDots />);

    expect(container.querySelectorAll('[data-dot]')).toHaveLength(3);
  });

  // A `status` live region announces its text content, and the role explicitly
  // does not take its name from content — so text is what to assert here.
  it('announces that something is loading', () => {
    render(<LoadingDots />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading');
  });

  it('takes a custom label', () => {
    render(<LoadingDots label="Fetching results" />);

    expect(screen.getByRole('status')).toHaveTextContent('Fetching results');
  });

  it('can stay silent when a parent already announces', () => {
    render(<LoadingDots label="" />);

    expect(screen.getByRole('status')).toHaveTextContent('');
  });

  it('keeps the dots out of the accessibility tree', () => {
    const { container } = render(<LoadingDots />);

    for (const dot of container.querySelectorAll('[data-dot]')) {
      expect(dot).toHaveAttribute('aria-hidden', 'true');
    }
  });

  it('spreads DOM props', () => {
    render(<LoadingDots id="cart-loading" className="tight" />);

    const dots = screen.getByRole('status');
    expect(dots).toHaveAttribute('id', 'cart-loading');
    expect(dots).toHaveClass('tight');
  });
});
