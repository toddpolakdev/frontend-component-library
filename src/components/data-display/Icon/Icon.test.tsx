import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Icon } from './Icon';
import { ICON_VARIANTS } from './variants';

/** The rendered <svg> for a given variant. */
function renderIcon(ui: React.ReactElement) {
  const { container } = render(ui);
  const svg = container.querySelector('svg');
  if (!svg) {
    throw new Error('no <svg> was rendered');
  }

  return svg;
}

describe('Icon', () => {
  it('renders the requested variant', () => {
    const svg = renderIcon(<Icon variant="Check" />);

    expect(svg).toHaveAttribute('data-variant', 'Check');
    expect(svg.querySelector('path')).toBeInTheDocument();
  });

  it('is hidden from screen readers by default', () => {
    const svg = renderIcon(<Icon variant="Trash" />);

    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
  });

  it('becomes an image with an accessible name when labelled', () => {
    render(<Icon variant="Trash" label="Delete item" />);

    const icon = screen.getByRole('img', { name: 'Delete item' });
    expect(icon).not.toHaveAttribute('aria-hidden');
  });

  it('defaults to 24px square and scales with size', () => {
    const base = renderIcon(<Icon variant="Plus" />);
    expect(base).toHaveAttribute('width', '24');
    expect(base).toHaveAttribute('height', '24');

    const large = renderIcon(<Icon variant="Plus" size={40} />);
    expect(large).toHaveAttribute('width', '40');
    expect(large).toHaveAttribute('height', '40');
  });

  it('accepts a CSS length as the size', () => {
    const svg = renderIcon(<Icon variant="Plus" size="1.5rem" />);

    expect(svg).toHaveAttribute('width', '1.5rem');
    expect(svg).toHaveAttribute('height', '1.5rem');
  });

  it('keeps the aspect ratio of the non-square wordmark', () => {
    const svg = renderIcon(<Icon variant="Vercel" size={20} />);

    // 89 × 20 art: square width would crush it.
    expect(svg).toHaveAttribute('width', '89');
    expect(svg).toHaveAttribute('height', '20');
  });

  it('paints outlined art with stroke and solid art with fill', () => {
    const outlined = renderIcon(<Icon variant="ChevronDown" />);
    expect(outlined).toHaveAttribute('stroke', 'currentColor');
    expect(outlined).toHaveAttribute('fill', 'none');

    const solid = renderIcon(<Icon variant="Star" />);
    expect(solid).toHaveAttribute('fill', 'currentColor');
    expect(solid).toHaveAttribute('stroke', 'none');
  });

  it('lets callers override paint and pass through DOM props', () => {
    const onClick = vi.fn();
    const svg = renderIcon(
      <Icon variant="Heart" fill="currentColor" className="wishlist" onClick={onClick} />,
    );

    expect(svg).toHaveAttribute('fill', 'currentColor');
    expect(svg).toHaveClass('wishlist');

    svg.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders every variant with drawable content', () => {
    for (const variant of ICON_VARIANTS) {
      const { container, unmount } = render(<Icon variant={variant} />);
      const svg = container.querySelector('svg');

      expect(svg, variant).not.toBeNull();
      expect(svg!.getAttribute('viewBox'), variant).toBeTruthy();
      // Each glyph must actually draw something.
      expect(svg!.querySelectorAll('path, circle, rect, line').length, variant).toBeGreaterThan(0);

      unmount();
    }
  });

  it('never hardcodes a colour or leaks a Tailwind class', () => {
    for (const variant of ICON_VARIANTS) {
      const { container, unmount } = render(<Icon variant={variant} />);
      const svg = container.querySelector('svg')!;

      // The source set shipped stroke="#000" and ne-* utility classes baked in;
      // both would break dark mode and neither works in this library.
      expect(svg.outerHTML, variant).not.toMatch(/#0{3,6}\b/i);
      expect(svg.outerHTML, variant).not.toMatch(/\bne-[a-z]/);

      unmount();
    }
  });
});
