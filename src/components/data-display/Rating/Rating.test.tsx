import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Rating } from './Rating';

/** Stars are `<span>`s wrapping a decorative icon, so count the svgs. */
const stars = (container: HTMLElement) => Array.from(container.querySelectorAll('svg'));

/**
 * Fill state is asserted from `data-filled`, not from the colour: jsdom doesn't
 * resolve styled-components' injected rules through `getComputedStyle`.
 */
const filledCount = (container: HTMLElement) =>
  container.querySelectorAll('[data-filled]').length;

describe('Rating', () => {
  it('draws five stars by default', () => {
    const { container } = render(<Rating value={3} />);

    expect(stars(container)).toHaveLength(5);
  });

  it('honours a custom max', () => {
    const { container } = render(<Rating value={7} max={10} />);

    expect(stars(container)).toHaveLength(10);
  });

  it('exposes the score to assistive tech', () => {
    // The source had no accessible name at all, and since the star icons are
    // decorative, screen readers were announced nothing whatsoever.
    render(<Rating value={4} />);

    expect(screen.getByRole('img', { name: 'Rated 4 out of 5' })).toBeInTheDocument();
  });

  it('announces the exact value, not the rounded star count', () => {
    render(<Rating value={4.5} />);

    expect(screen.getByRole('img', { name: 'Rated 4.5 out of 5' })).toBeInTheDocument();
  });

  it('accepts a custom label', () => {
    render(<Rating value={4} label="4 of 5 stars from 312 reviews" />);

    expect(
      screen.getByRole('img', { name: '4 of 5 stars from 312 reviews' }),
    ).toBeInTheDocument();
  });

  it('presents itself as one image, not a row of them', () => {
    render(<Rating value={3} />);

    expect(screen.getAllByRole('img')).toHaveLength(1);
  });

  it('records the resolved score for assertions', () => {
    render(<Rating value={3.2} />);

    expect(screen.getByRole('img')).toHaveAttribute('data-value', '3.2');
  });

  it('clamps a score above max', () => {
    render(<Rating value={9} />);

    expect(screen.getByRole('img')).toHaveAttribute('data-value', '5');
  });

  it('clamps a negative score to zero', () => {
    render(<Rating value={-2} />);

    expect(screen.getByRole('img')).toHaveAttribute('data-value', '0');
  });

  it('treats a non-numeric score as zero', () => {
    render(<Rating value={Number.NaN} />);

    expect(screen.getByRole('img')).toHaveAttribute('data-value', '0');
  });

  it('rounds fractions down when filling stars', () => {
    const { container } = render(<Rating value={4.9} />);

    expect(filledCount(container)).toBe(4);
  });

  it('fills nothing at zero and everything at max', () => {
    const { container: empty } = render(<Rating value={0} />);
    expect(filledCount(empty)).toBe(0);

    const { container: full } = render(<Rating value={5} />);
    expect(filledCount(full)).toBe(5);
  });

  it('sizes the stars', () => {
    const { container } = render(<Rating value={3} size={32} />);

    for (const svg of stars(container)) {
      expect(svg).toHaveAttribute('width', '32');
    }
  });

  it('spreads DOM props', () => {
    render(<Rating value={3} id="product-rating" className="compact" />);

    const rating = screen.getByRole('img');
    expect(rating).toHaveAttribute('id', 'product-rating');
    expect(rating).toHaveClass('compact');
  });
});
