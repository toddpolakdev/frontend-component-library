import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';

import { Icon } from '../Icon';
import { Badge, Frame, Picture } from './ImageZoom.styles';

/** How far one arrow press moves the zoom, in percent of the frame. */
const PAN_STEP = 10;

const clamp = (value: number) => Math.min(100, Math.max(0, value));

export interface ImageZoomProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  src: string;
  /** Describes the image. Required — this is usually the only view of a product. */
  alt: string;
  /** Edge length of the square viewport, in px. */
  size?: number;
  /** Magnification when zoomed, as a percentage of `size`. */
  zoom?: number;
  /**
   * Set false when this image is no longer the one on show — inside a carousel,
   * for instance — and any active zoom resets.
   */
  active?: boolean;
}

/**
 * Click (or tap) to magnify an image, then move the pointer to pan around it.
 *
 * Built on pointer events, so mouse, touch and pen all work through one path —
 * which is why there's no separate mobile variant here. The source shipped
 * `ImageZoomMobile` alongside this for touch, pulling in `react-quick-pinch-zoom`
 * to do it; the only thing that buys over this is true two-finger pinch.
 */
export function ImageZoom({
  src,
  alt,
  size = 600,
  zoom = 200,
  active = true,
  ...rest
}: ImageZoomProps) {
  const frameRef = useRef<HTMLButtonElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (!active) {
      setZoomed(false);
    }
  }, [active]);

  /**
   * Converts a viewport point into a percentage within the frame.
   *
   * The source measured `document.getElementsByClassName('zoom-image')[0]` — the
   * first match in the document — so with more than one on a page every instance
   * zoomed against the first one's box. It also tracked `window.scrollY` in state
   * to convert `pageY` into viewport coordinates, re-rendering on every scroll
   * event; `clientY` is already viewport-relative, so none of that is needed.
   */
  const trackPointer = (clientX: number, clientY: number) => {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }

    const { left, top, width, height } = frame.getBoundingClientRect();
    setPosition({
      x: clamp(((clientX - left) / width) * 100),
      y: clamp(((clientY - top) / height) * 100),
    });
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (zoomed) {
      trackPointer(event.clientX, event.clientY);
    }
  };

  const handleClick = (event: PointerEvent<HTMLButtonElement> | { clientX: number; clientY: number }) => {
    // Start the zoom under the pointer. A keyboard press reports 0,0, in which
    // case the existing centre is kept.
    if (!zoomed && event.clientX !== 0 && event.clientY !== 0) {
      trackPointer(event.clientX, event.clientY);
    }

    setZoomed((value) => !value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!zoomed) {
      return;
    }

    const pan: Record<string, [number, number]> = {
      ArrowLeft: [-PAN_STEP, 0],
      ArrowRight: [PAN_STEP, 0],
      ArrowUp: [0, -PAN_STEP],
      ArrowDown: [0, PAN_STEP],
    };

    const delta = pan[event.key];
    if (!delta) {
      return;
    }

    // Panning by keyboard, so a zoom that can be opened without a mouse can also
    // be explored without one.
    event.preventDefault();
    setPosition((current) => ({
      x: clamp(current.x + delta[0]),
      y: clamp(current.y + delta[1]),
    }));
  };

  return (
    <Frame
      {...rest}
      ref={frameRef}
      type="button"
      $size={size}
      $zoomed={zoomed}
      aria-pressed={zoomed}
      aria-label={zoomed ? `Zoom out of ${alt}` : `Zoom in on ${alt}`}
      data-zoomed={zoomed || undefined}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onKeyDown={handleKeyDown}
      style={
        zoomed
          ? {
              backgroundImage: `url("${src}")`,
              backgroundSize: `${(size * zoom) / 100}px`,
              backgroundPosition: `${position.x}% ${position.y}%`,
            }
          : undefined
      }
    >
      {/* Decorative: the button's label already carries the description. */}
      <Picture src={src} alt="" $hidden={zoomed} />

      <Badge $visible={hovering || zoomed} data-badge>
        <Icon variant={zoomed ? 'MagnifyMinus' : 'MagnifyPlus'} size={28} />
      </Badge>
    </Frame>
  );
}

ImageZoom.displayName = 'ImageZoom';

export default ImageZoom;
