import styled from 'styled-components';

/**
 * The slide-and-fade the source intended but never got.
 *
 * Its show/hide classes were written unprefixed — `transform`,
 * `translate-y-0 opacity-100`, `translate-y-full opacity-0` — while the package
 * generates utilities behind an `ne-` prefix. None of them matched anything, so
 * `hide` had no visual effect whatsoever and the bar could not be dismissed.
 *
 * `visibility` is set inline by the component so it's testable, and is included
 * in the transition here: it interpolates discretely, so the bar stays visible
 * for the whole slide-out and only then leaves the a11y tree and tab order.
 */
export const Bar = styled.div<{ $hide: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 50;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: var(--app-primary);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  opacity: ${({ $hide }) => ($hide ? 0 : 1)};
  transform: translateY(${({ $hide }) => ($hide ? '100%' : '0')});
  transition:
    transform 300ms ease-out,
    opacity 300ms ease-out,
    visibility 300ms;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 0.5rem;
    text-align: left;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Title = styled.span`
  font-weight: 600;
`;

export const Description = styled.span`
  font-weight: 400;
`;

export const ActionSlot = styled.div`
  display: flex;
  flex: none;
  align-items: center;

  @media (min-width: 768px) {
    margin-left: 0.5rem;
  }
`;
