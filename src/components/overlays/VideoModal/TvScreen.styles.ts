import styled, { css, keyframes } from 'styled-components';

const bloom = keyframes`
  0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(1); }
  50%      { opacity: 0.78; transform: translate(-50%, -50%) scale(1.06); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/* Sets up the camera. A long focal length keeps the panel from looking like a
   fisheye toy — this is a wall-mounted TV seen from a seat, not a close-up. */
export const Stage = styled.div`
  position: relative;
  width: min(1180px, 92vw);
  perspective: 2600px;
  perspective-origin: 50% 42%;
`;

/* The light the screen throws back onto the wall behind it (bias lighting). */
export const Bloom = styled.div<{ $on: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 118%;
  height: 118%;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(90px);
  transform: translate(-50%, -50%);
  background: radial-gradient(
    ellipse at center,
    rgba(120, 190, 255, 0.5) 0%,
    rgba(90, 120, 255, 0.28) 38%,
    rgba(255, 120, 90, 0.14) 62%,
    transparent 78%
  );
  opacity: ${({ $on }) => ($on ? 0.6 : 0.12)};
  transition: opacity 600ms ease;
  ${({ $on }) =>
    $on &&
    css`
      animation: ${bloom} 7s ease-in-out infinite;
    `}
`;

export const Panel = styled.div`
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
  transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
`;

/* The chassis: a thin slab. The visible thinness comes from the bright top
   edge, the dark under-edge and a real translateZ'd back plate. */
export const Chassis = styled.div`
  position: relative;
  transform-style: preserve-3d;
  padding: 7px;
  border-radius: 10px 10px 12px 12px;
  background: linear-gradient(180deg, #4a4f57 0%, #23272d 3px, #16191e 40%, #101317 100%)
    padding-box;
  box-shadow:
    /* the lit top edge that sells "thin" */ inset 0 1px 0 rgba(255, 255, 255, 0.28),
    inset 0 -1px 0 rgba(0, 0, 0, 0.9),
    inset 1px 0 0 rgba(255, 255, 255, 0.06),
    inset -1px 0 0 rgba(255, 255, 255, 0.06),
    0 2px 3px rgba(0, 0, 0, 0.9),
    0 30px 60px -12px rgba(0, 0, 0, 0.85),
    0 60px 120px -30px rgba(0, 0, 0, 0.9);

  /* Back plate, pushed into Z so the panel has measurable depth. */
  &::after {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 12px;
    background: linear-gradient(180deg, #101418, #05070a);
    transform: translateZ(-14px);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.9);
  }
`;

export const Glass = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 4px;
  overflow: hidden;
  background: #000;
  cursor: pointer;
  /* Inner shadow reads as the glass sitting below the bezel lip. */
  box-shadow:
    inset 0 0 0 1px rgba(0, 0, 0, 0.9),
    inset 0 2px 14px rgba(0, 0, 0, 0.8);
`;

/* The iframe fills the glass. Pointer events are disabled so YouTube's own
   chrome (title bar, watch-later, share) can never appear — the remote is the
   only control surface. Clicks are caught by ClickLayer above it. */
export const Mount = styled.div`
  position: absolute;
  inset: 0;

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
    pointer-events: none;
  }
`;

export const ClickLayer = styled.button`
  position: absolute;
  inset: 0;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  z-index: 3;
`;

/* Specular sheen raking across the glass. */
export const Sheen = styled.div`
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: 0.09;
  background: linear-gradient(
    104deg,
    transparent 12%,
    rgba(255, 255, 255, 0.55) 30%,
    rgba(255, 255, 255, 0.08) 40%,
    transparent 52%
  );
`;

/* Sub-pixel grid + vignette. Kept extremely faint: at 3% it reads as "this is
   a screen", at 10% it reads as "broken CSS". */
export const Grid = styled.div`
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  opacity: 0.035;
  background-image:
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.9) 0 1px, transparent 1px 3px),
    radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.9) 100%);
`;

export const Chin = styled.div`
  position: relative;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* Standby LED under the chin. */
export const Led = styled.span<{ $on: boolean }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${({ $on }) => ($on ? '#5ee08a' : '#7a2a2a')};
  box-shadow: 0 0 6px ${({ $on }) => ($on ? 'rgba(94, 224, 138, 0.9)' : 'rgba(200, 60, 60, 0.6)')};
  transition: all 400ms ease;
`;

/* Pedestal + base, both genuinely behind the panel in Z. */
export const Stand = styled.div`
  position: relative;
  height: 58px;
  transform-style: preserve-3d;
  display: flex;
  flex-direction: column;
  align-items: center;

  &::before {
    content: '';
    width: 74px;
    height: 40px;
    background: linear-gradient(180deg, #2a2f36, #0d1014);
    clip-path: polygon(28% 0, 72% 0, 88% 100%, 12% 100%);
    transform: translateZ(-18px);
  }

  &::after {
    content: '';
    width: 300px;
    max-width: 42%;
    height: 12px;
    margin-top: -2px;
    border-radius: 50% / 60%;
    background: linear-gradient(180deg, #333940 0%, #14171c 55%, #05070a 100%);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.12) inset,
      0 24px 40px -14px rgba(0, 0, 0, 0.95);
    transform: translateZ(-10px) rotateX(58deg);
  }
`;

export const Status = styled.div`
  position: absolute;
  inset: 0;
  z-index: 5;
  display: grid;
  place-items: center;
  pointer-events: none;
  color: #cfd6e4;
  font-size: 0.85rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

export const Spinner = styled.span`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.16);
  border-top-color: rgba(255, 255, 255, 0.85);
  animation: ${spin} 800ms linear infinite;
`;

/* Sits above the click layer so it can take its own click. */
export const UnmuteNote = styled.button`
  position: absolute;
  z-index: 6;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.5rem 0.95rem;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  color: #fff;
  background: rgba(12, 14, 18, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(6px);
  box-shadow: 0 8px 24px -8px rgba(0, 0, 0, 0.9);

  &:hover {
    background: rgba(30, 34, 42, 0.92);
  }
`;

export const ErrorNote = styled.div`
  max-width: 80%;
  padding: 0.9rem 1.4rem;
  border-radius: 8px;
  background: rgba(20, 6, 8, 0.85);
  border: 1px solid rgba(255, 120, 120, 0.35);
  color: #ffb4b4;
  text-transform: none;
  letter-spacing: 0.02em;
  line-height: 1.5;
  overflow-wrap: anywhere;
`;
