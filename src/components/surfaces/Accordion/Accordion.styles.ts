import styled from 'styled-components';

export const AccordionRoot = styled.div`
  position: relative;
  border-top: 1px solid var(--app-border);
  padding: 0.5rem 0;
  color: var(--app-text);
  font-size: 0.875rem;
  line-height: 1.5rem;
`;

/**
 * A real button. The source used a `<div onClick>`, which meant the accordion
 * couldn't be reached by Tab or opened with Enter/Space at all — this is the
 * whole reason for the rewrite.
 */
export const Header = styled.button<{ $iconPosition: 'start' | 'end' }>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: ${({ $iconPosition }) =>
    $iconPosition === 'start' ? 'flex-start' : 'space-between'};
  gap: ${({ $iconPosition }) => ($iconPosition === 'start' ? '0.65rem' : '1rem')};
  padding: 0.5rem 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;

  &:disabled {
    color: var(--app-muted);
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid var(--app-primary);
    outline-offset: 2px;
  }
`;

export const Title = styled.span`
  font-size: 0.875rem;
  font-weight: 300;
`;

export const IconSlot = styled.span<{ $rotated: boolean }>`
  display: flex;
  flex: none;
  color: var(--app-muted);
  transform: rotate(${({ $rotated }) => ($rotated ? '90deg' : '0deg')});
  transition: transform 200ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/**
 * `grid-template-rows: 0fr → 1fr` animates to the content's natural height with
 * no JS. The source read `contentRef.current.scrollHeight` during render to set
 * a max-height, which is null on first paint and stale after the content
 * changes, so the first expand often jumped instead of sliding.
 */
export const Panel = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? '1fr' : '0fr')};
  transition: grid-template-rows 400ms cubic-bezier(0.4, 0, 0.2, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/**
 * `visibility` keeps collapsed content out of the tab order and the
 * accessibility tree, and it interpolates discretely — so the panel stays
 * visible for the whole close animation, then disappears.
 *
 * The value itself is set inline by the component rather than here: jsdom
 * doesn't resolve styled-components' injected rules through `getComputedStyle`,
 * so as a class it would be invisible to tests and could regress unnoticed. The
 * transition still applies to it from here.
 */
export const PanelInner = styled.div`
  overflow: hidden;
  transition: visibility 400ms;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const PanelContent = styled.div`
  padding-bottom: 0.5rem;
  font-weight: 300;
  line-height: 1.5rem;
`;
