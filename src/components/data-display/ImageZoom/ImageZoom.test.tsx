import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ImageZoom } from './ImageZoom';

const ALT = 'Merino crew neck';
const SRC = '/sweater.jpg';

const frame = () => screen.getByRole('button');

/** jsdom gives every element a zero-sized rect, so measurement needs stubbing. */
function stubFrameBox() {
  vi.spyOn(HTMLButtonElement.prototype, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width: 400,
    height: 400,
    right: 400,
    bottom: 400,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('ImageZoom', () => {
  it('renders the image', () => {
    const { container } = render(<ImageZoom src={SRC} alt={ALT} />);

    const img = container.querySelector('img')!;
    expect(img).toHaveAttribute('src', SRC);
  });

  it('describes itself and its state', () => {
    render(<ImageZoom src={SRC} alt={ALT} />);

    expect(frame()).toHaveAccessibleName(`Zoom in on ${ALT}`);
    expect(frame()).toHaveAttribute('aria-pressed', 'false');
  });

  it('is a button, so the zoom works from the keyboard', () => {
    // The source used a <figure onClick>, making the whole feature mouse-only.
    render(<ImageZoom src={SRC} alt={ALT} />);

    expect(frame().tagName).toBe('BUTTON');
    expect(frame()).toHaveAttribute('type', 'button');
  });

  it('toggles the zoom on click', () => {
    render(<ImageZoom src={SRC} alt={ALT} />);

    fireEvent.click(frame());
    expect(frame()).toHaveAttribute('aria-pressed', 'true');
    expect(frame()).toHaveAccessibleName(`Zoom out of ${ALT}`);
    expect(frame()).toHaveAttribute('data-zoomed');

    fireEvent.click(frame());
    expect(frame()).toHaveAttribute('aria-pressed', 'false');
  });

  it('paints the magnified image only while zoomed', () => {
    render(<ImageZoom src={SRC} alt={ALT} size={400} zoom={200} />);

    expect(frame().style.backgroundImage).toBe('');

    fireEvent.click(frame());

    expect(frame().style.backgroundImage).toContain(SRC);
    // size × zoom%: 400 × 200% = 800px
    expect(frame().style.backgroundSize).toBe('800px');
  });

  it('starts the zoom under the pointer', () => {
    stubFrameBox();
    render(<ImageZoom src={SRC} alt={ALT} size={400} />);

    // A click at (100, 300) in a 400×400 box is 25% across, 75% down.
    fireEvent.click(frame(), { clientX: 100, clientY: 300 });

    expect(frame().style.backgroundPosition).toBe('25% 75%');
  });

  it('pans as the pointer moves', () => {
    stubFrameBox();
    render(<ImageZoom src={SRC} alt={ALT} size={400} />);

    fireEvent.click(frame(), { clientX: 200, clientY: 200 });
    expect(frame().style.backgroundPosition).toBe('50% 50%');

    fireEvent.pointerMove(frame(), { clientX: 400, clientY: 0 });
    expect(frame().style.backgroundPosition).toBe('100% 0%');
  });

  it('ignores pointer movement while not zoomed', () => {
    stubFrameBox();
    render(<ImageZoom src={SRC} alt={ALT} />);

    fireEvent.pointerMove(frame(), { clientX: 400, clientY: 400 });

    expect(frame().style.backgroundImage).toBe('');
  });

  it('clamps panning to the edges of the image', () => {
    stubFrameBox();
    render(<ImageZoom src={SRC} alt={ALT} size={400} />);

    fireEvent.click(frame(), { clientX: 200, clientY: 200 });
    fireEvent.pointerMove(frame(), { clientX: 900, clientY: -400 });

    expect(frame().style.backgroundPosition).toBe('100% 0%');
  });

  it('pans with the arrow keys', () => {
    render(<ImageZoom src={SRC} alt={ALT} />);

    // Keyboard click reports 0,0, so the centre is kept.
    fireEvent.click(frame());
    expect(frame().style.backgroundPosition).toBe('50% 50%');

    fireEvent.keyDown(frame(), { key: 'ArrowRight' });
    expect(frame().style.backgroundPosition).toBe('60% 50%');

    fireEvent.keyDown(frame(), { key: 'ArrowUp' });
    expect(frame().style.backgroundPosition).toBe('60% 40%');
  });

  it('leaves the arrow keys alone when not zoomed', () => {
    render(<ImageZoom src={SRC} alt={ALT} />);

    fireEvent.keyDown(frame(), { key: 'ArrowRight' });

    expect(frame().style.backgroundPosition).toBe('');
  });

  it('resets the zoom when it stops being the active image', () => {
    const { rerender } = render(<ImageZoom src={SRC} alt={ALT} active />);

    fireEvent.click(frame());
    expect(frame()).toHaveAttribute('aria-pressed', 'true');

    rerender(<ImageZoom src={SRC} alt={ALT} active={false} />);
    expect(frame()).toHaveAttribute('aria-pressed', 'false');
  });

  it('measures its own box, not another instance', () => {
    // The source queried getElementsByClassName('zoom-image')[0], so every
    // instance on a page zoomed against the first one's rect.
    const rects = new Map<Element, DOMRect>();
    vi.spyOn(HTMLButtonElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLButtonElement) {
        return rects.get(this)!;
      },
    );

    render(
      <>
        <ImageZoom src="/a.jpg" alt="First" size={400} />
        <ImageZoom src="/b.jpg" alt="Second" size={400} />
      </>,
    );

    const [first, second] = screen.getAllByRole('button');
    const box = (left: number) =>
      ({ left, top: 0, width: 400, height: 400, right: left + 400, bottom: 400, x: left, y: 0, toJSON: () => ({}) }) as DOMRect;

    rects.set(first, box(0));
    rects.set(second, box(1000));

    // A click 1100px across is 25% into the second frame, not off the first.
    fireEvent.click(second, { clientX: 1100, clientY: 200 });

    expect(second.style.backgroundPosition).toBe('25% 50%');
  });

  it('swaps the magnifier icon with the state', () => {
    const { container } = render(<ImageZoom src={SRC} alt={ALT} />);
    const variant = () => container.querySelector('svg')?.getAttribute('data-variant');

    expect(variant()).toBe('MagnifyPlus');

    fireEvent.click(frame());
    expect(variant()).toBe('MagnifyMinus');
  });

  it('spreads DOM props', () => {
    render(<ImageZoom src={SRC} alt={ALT} id="gallery-main" className="wide" />);

    expect(frame()).toHaveAttribute('id', 'gallery-main');
    expect(frame()).toHaveClass('wide');
  });
});
