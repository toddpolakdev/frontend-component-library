import styled from 'styled-components';

/**
 * A fieldset/legend pair, so the group and its label are native. The source used
 * a plain div plus a `<p>` heading with no association between them.
 */
export const Fieldset = styled.fieldset`
  margin: 0 0 1rem;
  padding: 0;
  border: 0;
  min-width: 0;
`;

export const Legend = styled.legend`
  padding: 0;
  margin: 0.3rem 0 0.6rem;
  color: var(--app-text);
  font-size: 0.9375rem;
`;

export const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  width: 100%;
  padding: 20px;
  border: 1px solid var(--app-border);
  border-radius: 8px;
  background: var(--app-surface);
`;

/**
 * The tile is a `<label>` wrapping a real radio input, which is what buys the
 * keyboard behaviour: Tab into the group, arrows to move between options. The
 * source used `<div onClick>` tiles, unreachable without a mouse.
 */
export const Tile = styled.label<{ $size: number; $selected: boolean; $disabled: boolean }>`
  position: relative;
  display: flex;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--app-surface-muted);
  border: 1px solid
    ${({ $selected }) => ($selected ? 'var(--app-text)' : 'var(--app-border)')};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  transition: border-color 150ms ease;

  &:hover {
    border-color: ${({ $selected, $disabled }) =>
      $disabled || $selected ? undefined : 'var(--app-border-strong)'};
  }

  /* The input is invisible but still focusable, so the ring goes on the tile. */
  &:focus-within {
    outline: 2px solid var(--app-primary);
    outline-offset: 2px;
  }
`;

export const RadioInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;

export const Thumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Caption = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 27px;
  align-items: center;
  justify-content: center;
  padding: 0 2px;
  background: var(--app-surface-muted);
  color: var(--app-text);
  font-size: 9px;
  text-align: center;
`;

/**
 * Revealed on hover *and* focus — the source showed it on hover only, so a
 * keyboard user never saw the label of an image-only tile.
 *
 * Centred above the tile rather than flipped left/right at ±215px based on
 * `getBoundingClientRect().x < 250`, which assumed the picker sat at the left
 * edge of a wide viewport and misplaced the tooltip anywhere else.
 */
export const Tooltip = styled.span`
  position: absolute;
  bottom: calc(100% + 9px);
  left: 50%;
  z-index: 2;
  transform: translateX(-50%);
  display: flex;
  min-width: max-content;
  max-width: 198px;
  align-items: center;
  justify-content: center;
  padding: 5px 15px;
  border: 1px solid var(--app-border);
  border-radius: 6px;
  background: var(--app-surface);
  color: var(--app-text);
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 120ms ease,
    visibility 120ms;

  /* The caret. */
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 8px solid transparent;
    border-top-color: var(--app-surface);
  }

  ${Tile}:hover &,
  ${Tile}:focus-within & {
    opacity: 1;
    visibility: visible;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
