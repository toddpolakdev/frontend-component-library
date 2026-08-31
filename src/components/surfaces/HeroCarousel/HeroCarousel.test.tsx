import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { HeroCarousel, type HeroSlide } from './HeroCarousel';

const SLIDES: HeroSlide[] = [
  { id: 'a', image: '/a.jpg', title: 'Oatmeal crew', href: '/p/a' },
  { id: 'b', image: '/b.jpg', title: 'Navy crew', href: '/p/b' },
  { id: 'c', image: '/c.jpg', title: 'Moss crew', href: '/p/c' },
];

const activeSlide = (container: HTMLElement) => container.querySelector('[data-active]');

describe('HeroCarousel', () => {
  it('renders every slide and shows the first', () => {
    const { container } = render(<HeroCarousel slides={SLIDES} />);

    expect(container.querySelectorAll('img')).toHaveLength(3);
    expect(activeSlide(container)).toHaveAttribute('aria-label', '1 of 3');
  });

  it('renders nothing without slides', () => {
    const { container } = render(<HeroCarousel slides={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('is a labelled carousel region', () => {
    render(<HeroCarousel slides={SLIDES} label="Featured products" />);

    const region = screen.getByRole('region', { name: 'Featured products' });
    expect(region).toHaveAttribute('aria-roledescription', 'carousel');
  });

  it('keeps inactive slides out of the accessibility tree', () => {
    // The source faded them with opacity, which leaves their headings and links
    // announced — a screen reader read all three slides at once.
    render(<HeroCarousel slides={SLIDES} />);

    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/p/a');
  });

  it('steps forward and back', () => {
    const { container } = render(<HeroCarousel slides={SLIDES} />);

    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(activeSlide(container)).toHaveAttribute('aria-label', '2 of 3');

    fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }));
    expect(activeSlide(container)).toHaveAttribute('aria-label', '1 of 3');
  });

  it('wraps around at both ends', () => {
    const { container } = render(<HeroCarousel slides={SLIDES} />);

    fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }));
    expect(activeSlide(container)).toHaveAttribute('aria-label', '3 of 3');

    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(activeSlide(container)).toHaveAttribute('aria-label', '1 of 3');
  });

  it('gives the arrows real names, not glyphs', () => {
    // The source's buttons contained ❮ and ❯ with no aria-label, so that is what
    // a screen reader announced.
    render(<HeroCarousel slides={SLIDES} />);

    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeInTheDocument();
  });

  it('jumps from the dots, which are real buttons', () => {
    const { container } = render(<HeroCarousel slides={SLIDES} />);

    const dot = screen.getByRole('button', { name: 'Go to slide 3' });
    expect(dot.tagName).toBe('BUTTON');

    fireEvent.click(dot);

    expect(activeSlide(container)).toHaveAttribute('aria-label', '3 of 3');
    expect(dot).toHaveAttribute('aria-current', 'true');
  });

  it('can open on a given slide', () => {
    const { container } = render(<HeroCarousel slides={SLIDES} startIndex={1} />);

    expect(activeSlide(container)).toHaveAttribute('aria-label', '2 of 3');
  });

  it('reports slide changes', () => {
    const onChange = vi.fn();
    render(<HeroCarousel slides={SLIDES} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }));

    expect(onChange).toHaveBeenCalledWith(SLIDES[1], 1);
  });

  it('hides the controls for a single slide', () => {
    render(<HeroCarousel slides={[SLIDES[0]]} />);

    expect(screen.queryByRole('button', { name: 'Next slide' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Go to slide/ })).not.toBeInTheDocument();
  });

  it('falls back to the title for alt text', () => {
    const { container } = render(
      <HeroCarousel slides={[{ id: 'a', image: '/a.jpg', title: 'Oatmeal crew' }]} />,
    );

    expect(container.querySelector('img')).toHaveAttribute('alt', 'Oatmeal crew');
  });

  it('stays valid when slides shrink underneath it', () => {
    const { container, rerender } = render(<HeroCarousel slides={SLIDES} startIndex={2} />);
    expect(activeSlide(container)).toHaveAttribute('aria-label', '3 of 3');

    rerender(<HeroCarousel slides={SLIDES.slice(0, 2)} />);

    expect(activeSlide(container)).toHaveAttribute('aria-label', '2 of 2');
  });
});

describe('HeroCarousel autoplay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not advance on its own by default', () => {
    const { container } = render(<HeroCarousel slides={SLIDES} />);

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(activeSlide(container)).toHaveAttribute('aria-label', '1 of 3');
  });

  it('advances on an interval when asked', () => {
    const { container } = render(<HeroCarousel slides={SLIDES} autoPlayInterval={3000} />);

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(activeSlide(container)).toHaveAttribute('aria-label', '2 of 3');

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(activeSlide(container)).toHaveAttribute('aria-label', '3 of 3');
  });

  it('pauses while the pointer is over it', () => {
    // The source had a `pause` state for exactly this, wired to nothing.
    const { container } = render(<HeroCarousel slides={SLIDES} autoPlayInterval={3000} />);

    fireEvent.pointerEnter(screen.getByRole('region'));

    act(() => {
      vi.advanceTimersByTime(9000);
    });
    expect(activeSlide(container)).toHaveAttribute('aria-label', '1 of 3');

    fireEvent.pointerLeave(screen.getByRole('region'));

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(activeSlide(container)).toHaveAttribute('aria-label', '2 of 3');
  });

  it('pauses while something inside has focus', () => {
    const { container } = render(<HeroCarousel slides={SLIDES} autoPlayInterval={3000} />);

    fireEvent.focus(screen.getByRole('button', { name: 'Next slide' }));

    act(() => {
      vi.advanceTimersByTime(9000);
    });

    expect(activeSlide(container)).toHaveAttribute('aria-label', '1 of 3');
  });

  it('stops the timer on unmount', () => {
    const onChange = vi.fn();
    const { unmount } = render(
      <HeroCarousel slides={SLIDES} autoPlayInterval={3000} onChange={onChange} />,
    );

    unmount();

    act(() => {
      vi.advanceTimersByTime(9000);
    });

    expect(onChange).not.toHaveBeenCalled();
  });
});
