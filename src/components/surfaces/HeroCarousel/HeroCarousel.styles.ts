import styled from 'styled-components';

export const CarouselRoot = styled.section`
  position: relative;
  height: 50vh;
  min-height: 300px;
  max-height: 1000px;
  margin-bottom: 2rem;
  overflow: hidden;
`;

/**
 * Inactive slides are hidden with `visibility`, not just faded out.
 *
 * The source stacked every slide and set `opacity: 0` plus
 * `pointer-events: none` on the inactive ones — which leaves their headings and
 * links in the accessibility tree, so a screen reader read all of them at once.
 */
export const Slide = styled.div<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition:
    opacity 500ms ease-in-out,
    visibility 500ms;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Caption = styled.div`
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;

  @media (min-width: 640px) {
    top: auto;
    bottom: 20%;
    left: 100px;
    transform: none;
    text-align: left;
  }

  @media (min-width: 768px) {
    left: 130px;
  }
`;

export const SlideTitle = styled.p`
  margin: 0.3rem 0 0.6rem;
  color: var(--app-text);
  font-size: 1.5rem;
`;

export const SlideLink = styled.a`
  display: inline-block;
  border-bottom: 1px solid var(--app-muted);
  color: var(--app-muted);
  font-size: 1.25rem;
  line-height: 1.625;
  text-decoration: none;

  &:hover {
    border-bottom-color: var(--app-text);
    color: var(--app-text);
  }
`;

export const StepButton = styled.button<{ $side: 'prev' | 'next' }>`
  position: absolute;
  top: 50%;
  ${({ $side }) => ($side === 'prev' ? 'left: 10px;' : 'right: 10px;')}
  z-index: 2;
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
  border: 0;
  border-radius: 50%;
  background: var(--app-surface);
  color: var(--app-text);
  cursor: pointer;

  &:hover {
    background: var(--app-text);
    color: var(--app-surface);
  }

  &:focus-visible {
    outline: 2px solid var(--app-primary);
    outline-offset: 2px;
  }

  @media (min-width: 640px) {
    ${({ $side }) => ($side === 'prev' ? 'left: 30px;' : 'right: 30px;')}
  }
`;

export const Dots = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  z-index: 2;
  display: flex;
  gap: 20px;
  transform: translateX(-50%);
`;

/**
 * A button, not a `<span onClick>`. The source's dots couldn't be focused or
 * activated from the keyboard and had no accessible name.
 */
export const Dot = styled.button<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? 'var(--app-text)' : 'var(--app-border-strong)')};
  cursor: pointer;

  &:hover {
    background: var(--app-text);
  }

  &:focus-visible {
    outline: 2px solid var(--app-primary);
    outline-offset: 3px;
  }
`;
