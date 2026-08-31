import styled from 'styled-components';

/**
 * A real button. The source was a `<div onClick>` — unfocusable, no keyboard, and
 * nothing announcing that it was selectable or currently chosen.
 *
 * Height is a minimum rather than the source's fixed `h-24`, so a longer
 * description grows the tile instead of spilling out of it.
 */
export const Tile = styled.button<{ $selected: boolean }>`
  display: flex;
  width: 9rem;
  min-height: 6rem;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.75rem;
  border: 1px solid ${({ $selected }) => ($selected ? 'var(--app-primary)' : 'var(--app-border)')};
  border-radius: 0.5rem;
  background: ${({ $selected }) => ($selected ? 'var(--app-primary-soft)' : 'var(--app-surface)')};
  color: var(--app-text);
  cursor: pointer;
  font: inherit;
  text-align: left;
  transition:
    border-color 140ms ease,
    background 140ms ease;

  &:hover:not(:disabled) {
    border-color: var(--app-border-strong);
  }

  &:disabled {
    color: var(--app-muted);
    cursor: not-allowed;
    opacity: 0.55;
  }

  &:focus-visible {
    outline: 2px solid var(--app-primary);
    outline-offset: 2px;
  }
`;

/**
 * The source referenced an `.icon` class that its CSS module never defined, so
 * the icon was left entirely unstyled — `s.icon` resolved to `undefined`.
 */
export const IconSlot = styled.span`
  display: flex;
  margin-bottom: 0.15rem;
`;

export const Title = styled.span`
  font-size: 1rem;
  font-weight: 700;
`;

export const Description = styled.span`
  color: var(--app-muted);
  font-size: 0.75rem;
  line-height: 1.25;
`;
