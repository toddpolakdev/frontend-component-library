import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LoadingOverlay } from './LoadingOverlay';

describe('LoadingOverlay', () => {
  it('shows a spinner by default', () => {
    const { container } = render(<LoadingOverlay />);

    expect(container.querySelector('[data-spinner]')).toBeInTheDocument();
  });

  it('announces that the page is busy', () => {
    // The source had no role and no label, so this was silent to assistive tech.
    render(<LoadingOverlay />);

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Loading');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  it('takes a custom label', () => {
    render(<LoadingOverlay label="Updating your basket" />);

    expect(screen.getByRole('status')).toHaveTextContent('Updating your basket');
  });

  it('can stay silent when a parent already announces', () => {
    render(<LoadingOverlay label="" />);

    expect(screen.getByRole('status')).toHaveTextContent('');
  });

  it('keeps the spinner out of the accessibility tree', () => {
    const { container } = render(<LoadingOverlay />);

    expect(container.querySelector('[data-spinner]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('replaces the spinner with children', () => {
    const { container } = render(
      <LoadingOverlay>
        <p>Almost there…</p>
      </LoadingOverlay>,
    );

    expect(screen.getByText('Almost there…')).toBeInTheDocument();
    expect(container.querySelector('[data-spinner]')).toBeNull();
  });

  it('covers the viewport unless contained', () => {
    const { rerender, container } = render(<LoadingOverlay />);
    expect(container.firstElementChild).not.toHaveAttribute('data-contained');

    rerender(<LoadingOverlay contained />);
    expect(container.firstElementChild).toHaveAttribute('data-contained');
  });

  it('spreads DOM props', () => {
    render(<LoadingOverlay id="basket-busy" className="dim" />);

    const overlay = screen.getByRole('status');
    expect(overlay).toHaveAttribute('id', 'basket-busy');
    expect(overlay).toHaveClass('dim');
  });
});
