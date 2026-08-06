import styled, { css, keyframes } from 'styled-components';

const blink = keyframes`
  0%   { opacity: 1; box-shadow: 0 0 12px 3px rgba(255, 92, 60, 0.95); }
  100% { opacity: 0.25; box-shadow: 0 0 0 0 rgba(255, 92, 60, 0); }
`;

export const Shell = styled.div<{ $collapsed: boolean }>`
  position: fixed;
  z-index: 1200;
  width: 268px;
  padding: 10px 12px 14px;
  border-radius: 26px;
  user-select: none;
  touch-action: none;
  color: #e8ecf4;
  font-size: 12px;

  /* Soft-touch plastic: light from above, deep shadow below. */
  background:
    radial-gradient(120% 60% at 50% -10%, rgba(255, 255, 255, 0.16), transparent 60%),
    linear-gradient(180deg, #23262c 0%, #16181d 34%, #0c0e11 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    inset 0 -2px 6px rgba(0, 0, 0, 0.8),
    0 30px 60px -18px rgba(0, 0, 0, 0.95),
    0 10px 20px -10px rgba(0, 0, 0, 0.9);

  ${({ $collapsed }) =>
    $collapsed &&
    css`
      width: 208px;
      padding-bottom: 10px;
    `}

  @media (max-width: 720px) {
    width: 232px;
  }
`;

export const Handle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 2px 2px 8px;
  cursor: grab;
  color: rgba(255, 255, 255, 0.35);

  &:active {
    cursor: grabbing;
  }
`;

/* The IR emitter, pulsed on every command like a real remote. */
export const Ir = styled.span<{ $flash: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff5c3c;
  opacity: 0.25;
  ${({ $flash }) =>
    $flash &&
    css`
      animation: ${blink} 320ms ease-out;
    `}
`;

export const Collapse = styled.button`
  background: none;
  border: 0;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 2px 4px;
  display: flex;

  &:hover {
    color: #fff;
  }
`;

export const Lcd = styled.div`
  border-radius: 10px;
  padding: 9px 10px 7px;
  margin-bottom: 12px;
  background: linear-gradient(180deg, #0c1a12 0%, #08120d 100%);
  border: 1px solid rgba(0, 0, 0, 0.8);
  box-shadow:
    inset 0 2px 6px rgba(0, 0, 0, 0.9),
    0 1px 0 rgba(255, 255, 255, 0.06);
  color: #7dffb2;
  font-family: 'SFMono-Regular', ui-monospace, 'Cascadia Mono', Menlo, monospace;
  text-shadow: 0 0 8px rgba(125, 255, 178, 0.45);
`;

export const LcdRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.04em;
`;

export const LcdTitle = styled.div`
  margin: 4px 0 6px;
  font-size: 10.5px;
  line-height: 1.35;
  opacity: 0.82;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const LcdSlot = styled.div`
  margin-top: 8px;
`;

export const Badge = styled.span`
  opacity: 0.6;
  font-size: 9.5px;
`;

/* Range inputs styled as remote sliders. */
export const Slider = styled.input.attrs({ type: 'range' })<{ $fill: number }>`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 3px;
  cursor: pointer;
  background: ${({ $fill }) =>
    `linear-gradient(90deg, #7dffb2 0%, #4fd48a ${$fill}%, rgba(255, 255, 255, 0.13) ${$fill}%, rgba(255, 255, 255, 0.13) 100%)`};

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: #eafff2;
    box-shadow: 0 0 6px rgba(125, 255, 178, 0.8);
    cursor: grab;
  }

  &::-moz-range-thumb {
    width: 11px;
    height: 11px;
    border: 0;
    border-radius: 50%;
    background: #eafff2;
    box-shadow: 0 0 6px rgba(125, 255, 178, 0.8);
    cursor: grab;
  }
`;

const keyFace = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-radius: 9px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  color: #cdd4e0;
  cursor: pointer;
  font-size: 12px;
  background: linear-gradient(180deg, #33383f 0%, #22262c 55%, #191c21 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 2px 0 rgba(0, 0, 0, 0.6),
    0 4px 8px -3px rgba(0, 0, 0, 0.9);
  transition:
    transform 70ms ease,
    box-shadow 70ms ease,
    color 140ms ease;

  &:hover:not(:disabled) {
    color: #fff;
  }

  /* Physical key travel. */
  &:active:not(:disabled) {
    transform: translateY(2px);
    box-shadow:
      inset 0 2px 5px rgba(0, 0, 0, 0.75),
      0 0 0 rgba(0, 0, 0, 0);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid #7dffb2;
    outline-offset: 2px;
  }
`;

export const Key = styled.button<{ $active?: boolean; $wide?: boolean }>`
  ${keyFace};
  height: 32px;
  padding: 0 6px;
  flex: ${({ $wide }) => ($wide ? '2' : '1')};

  ${({ $active }) =>
    $active &&
    css`
      color: #7dffb2;
      border-color: rgba(125, 255, 178, 0.4);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.14),
        0 0 12px rgba(125, 255, 178, 0.28),
        0 2px 0 rgba(0, 0, 0, 0.6);
    `}
`;

export const PowerKey = styled.button`
  ${keyFace};
  width: 38px;
  height: 38px;
  border-radius: 50%;
  color: #ffdede;
  background: linear-gradient(180deg, #b8323a 0%, #7e1d24 60%, #58131a 100%);
  border-color: rgba(255, 255, 255, 0.14);
  font-size: 14px;

  &:hover {
    color: #fff;
  }
`;

export const Row = styled.div<{ $gap?: number }>`
  display: flex;
  gap: ${({ $gap = 6 }) => `${$gap}px`};
  margin-bottom: 8px;
`;

export const Section = styled.div`
  margin-bottom: 10px;
`;

export const Label = styled.div`
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.28);
  margin: 12px 2px 6px;
`;

export const VolumeSlot = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
  padding: 0 6px;
`;

export const Dpad = styled.div`
  position: relative;
  width: 132px;
  height: 132px;
  margin: 2px auto 12px;
  border-radius: 50%;
  background: linear-gradient(180deg, #2b3037 0%, #171a1f 100%);
  box-shadow:
    inset 0 2px 4px rgba(255, 255, 255, 0.1),
    inset 0 -3px 8px rgba(0, 0, 0, 0.8),
    0 6px 14px -6px rgba(0, 0, 0, 0.9);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  place-items: center;
`;

export const DKey = styled.button`
  background: none;
  border: 0;
  color: rgba(214, 222, 235, 0.75);
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-size: 13px;
  border-radius: 8px;
  transition:
    color 120ms ease,
    background 120ms ease;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.06);
  }

  &:active {
    background: rgba(0, 0, 0, 0.4);
  }

  &:focus-visible {
    outline: 2px solid #7dffb2;
    outline-offset: -3px;
  }
`;

export const Ok = styled.button`
  grid-column: 2;
  grid-row: 2;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  color: #f2f5fa;
  font-size: 16px;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #3b424b 0%, #232830 60%, #1a1e24 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 3px 0 rgba(0, 0, 0, 0.65),
    0 6px 12px -4px rgba(0, 0, 0, 0.9);
  transition:
    transform 70ms ease,
    box-shadow 70ms ease;

  &:active {
    transform: translateY(2px);
    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.8);
  }

  &:focus-visible {
    outline: 2px solid #7dffb2;
    outline-offset: 3px;
  }
`;

export const Keypad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
`;

export const NumKey = styled.button`
  ${keyFace};
  height: 30px;
  flex-direction: column;
  gap: 0;
  font-size: 13px;
  font-weight: 600;
`;

export const Select = styled.select`
  ${keyFace};
  height: 32px;
  flex: 1;
  padding: 0 6px;
  appearance: none;
  text-align: center;
  text-align-last: center;

  option {
    background: #16181d;
    color: #e8ecf4;
  }
`;
