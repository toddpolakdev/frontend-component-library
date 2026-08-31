import { useCallback, useEffect, useRef, useState, type HTMLAttributes } from 'react';

import { Icon } from '../../data-display';
import {
  Caption,
  CarouselRoot,
  Dot,
  Dots,
  Slide,
  SlideImage,
  SlideLink,
  SlideTitle,
  StepButton,
} from './HeroCarousel.styles';

export interface HeroSlide {
  /** Stable key, and the value reported by onChange. */
  id: string;
  image: string;
  /** Describes the image. Falls back to `title` when omitted. */
  alt?: string;
  title?: string;
  /** Where the call to action goes. Omit for a slide that isn't a link. */
  href?: string;
  ctaLabel?: string;
}

export interface HeroCarouselProps
  // `onChange` on HTMLAttributes is the form-event kind; ours reports the slide.
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onChange'> {
  slides: HeroSlide[];
  /** Index to open on. */
  startIndex?: number;
  onChange?: (slide: HeroSlide, index: number) => void;
  /**
   * Advance automatically every N milliseconds. Off by default. Pauses on hover
   * and on focus, and stays off entirely for anyone who prefers reduced motion.
   */
  autoPlayInterval?: number;
  /** Accessible name for the carousel region. */
  label?: string;
}

/**
 * A full-width image carousel with a caption, arrows and dots.
 *
 * Generalised from the source, which took Amplience-shaped slides
 * (`slide.productImage.url`, `slide.productName`, `_meta`) and ran every URL
 * through `getLoaderUrl` from the app's utils. Slides are a plain shape here.
 *
 * The source also kept a `pause` state, toggled on mouse enter and leave, that
 * nothing ever read — there was no autoplay to pause. `autoPlayInterval` makes
 * that intent real, and opt-in.
 */
export function HeroCarousel({
  slides,
  startIndex = 0,
  onChange,
  autoPlayInterval,
  label = 'Featured',
  ...rest
}: HeroCarouselProps) {
  const [index, setIndex] = useState(startIndex);
  const [paused, setPaused] = useState(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const count = slides.length;

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) {
        return;
      }

      const wrapped = (next + count) % count;
      setIndex(wrapped);
      onChangeRef.current?.(slides[wrapped], wrapped);
    },
    [count, slides],
  );

  // Keep the index valid if the slides change underneath us.
  useEffect(() => {
    if (index > count - 1) {
      setIndex(count === 0 ? 0 : count - 1);
    }
  }, [count, index]);

  useEffect(() => {
    if (!autoPlayInterval || paused || count < 2) {
      return;
    }

    // An auto-advancing carousel that can't be stopped fails WCAG 2.2.2, so
    // reduced-motion users get a static one.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => {
        const next = (current + 1) % count;
        onChangeRef.current?.(slides[next], next);
        return next;
      });
    }, autoPlayInterval);

    return () => window.clearInterval(timer);
  }, [autoPlayInterval, paused, count, slides]);

  if (count === 0) {
    return null;
  }

  return (
    <CarouselRoot
      {...rest}
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, slideIndex) => {
        const isActive = slideIndex === index;

        return (
          <Slide
            key={slide.id}
            $active={isActive}
            data-active={isActive || undefined}
            aria-roledescription="slide"
            aria-label={`${slideIndex + 1} of ${count}`}
            // Keeps inactive slides out of the tab order and off screen readers.
            style={{ visibility: isActive ? 'visible' : 'hidden' }}
          >
            <SlideImage
              src={slide.image}
              alt={slide.alt ?? slide.title ?? ''}
              loading={slideIndex === 0 ? 'eager' : 'lazy'}
            />

            {slide.title || slide.href ? (
              <Caption>
                {slide.title ? <SlideTitle>{slide.title}</SlideTitle> : null}
                {slide.href ? (
                  <SlideLink href={slide.href}>{slide.ctaLabel ?? 'View product'}</SlideLink>
                ) : null}
              </Caption>
            ) : null}
          </Slide>
        );
      })}

      {count > 1 ? (
        <>
          <StepButton
            type="button"
            $side="prev"
            aria-label="Previous slide"
            onClick={() => goTo(index - 1)}
          >
            <Icon variant="ChevronLeft" size={20} />
          </StepButton>

          <StepButton
            type="button"
            $side="next"
            aria-label="Next slide"
            onClick={() => goTo(index + 1)}
          >
            <Icon variant="ChevronRight" size={20} />
          </StepButton>

          <Dots>
            {slides.map((slide, slideIndex) => (
              <Dot
                key={slide.id}
                type="button"
                $active={slideIndex === index}
                aria-label={`Go to slide ${slideIndex + 1}`}
                aria-current={slideIndex === index || undefined}
                onClick={() => goTo(slideIndex)}
              />
            ))}
          </Dots>
        </>
      ) : null}
    </CarouselRoot>
  );
}

HeroCarousel.displayName = 'HeroCarousel';

export default HeroCarousel;
