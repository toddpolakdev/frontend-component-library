import styled from 'styled-components';

/**
 * A neutral full-screen scrim — deliberately plain so the overlay doesn't
 * impose a look on the host app. It is near-opaque rather than tinted because
 * a video panel needs a dark surround to read; nothing else here is decorative.
 */
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  overflow: hidden;
  display: grid;
  place-items: center;
  padding: clamp(12px, 3vh, 40px);
  background: rgb(2 6 23 / 94%);
`;

export const ScreenSlot = styled.div`
  position: relative;
  z-index: 2;
  margin-bottom: clamp(16px, 5vh, 64px);
`;

/* In normal flow above the screen. Absolutely positioning this collided with
   the top of the chassis on short viewports and clipped the title. */
export const Caption = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  pointer-events: none;
  max-width: min(760px, 80vw);
  margin-bottom: clamp(8px, 2vh, 22px);

  h2 {
    margin: 0;
    font-size: clamp(0.85rem, 1.5vw, 1.05rem);
    font-weight: 600;
    letter-spacing: 0.04em;
    color: rgb(255 255 255 / 82%);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    margin: 4px 0 0;
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgb(255 255 255 / 40%);
  }
`;

/* Shown only when the remote is hidden — without it there'd be no pointer
   affordance for closing, leaving mouse-only users stuck on Escape. */
export const CloseButton = styled.button`
  position: absolute;
  top: clamp(10px, 2vh, 24px);
  right: clamp(10px, 2vw, 28px);
  z-index: 4;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  color: rgb(255 255 255 / 75%);
  background: rgb(255 255 255 / 8%);
  border: 1px solid rgb(255 255 255 / 18%);
  transition:
    color 140ms ease,
    background 140ms ease;

  &:hover {
    color: #fff;
    background: rgb(255 255 255 / 16%);
  }

  &:focus-visible {
    outline: 2px solid rgb(255 255 255 / 70%);
    outline-offset: 2px;
  }
`;

export const Hint = styled.div`
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  font-size: 10px;
  letter-spacing: 0.12em;
  color: rgb(255 255 255 / 24%);
  pointer-events: none;
  text-align: center;
`;
