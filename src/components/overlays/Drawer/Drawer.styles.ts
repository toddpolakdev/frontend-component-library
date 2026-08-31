import styled from 'styled-components';

export type DrawerSide = 'left' | 'right';

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgb(0 0 0 / 40%);
  backdrop-filter: blur(0.8px);
`;

/**
 * The panel slides in from the chosen edge. The source had no transition at all —
 * the sidebar simply appeared.
 */
export const Panel = styled.aside<{ $side: DrawerSide; $width: string }>`
  position: fixed;
  top: 0;
  bottom: 0;
  ${({ $side }) => ($side === 'left' ? 'left: 0;' : 'right: 0;')}
  z-index: 51;
  display: flex;
  width: 100%;
  max-width: ${({ $width }) => $width};
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  background: var(--app-surface);
  color: var(--app-text);
  box-shadow: var(--app-shadow);
  -webkit-overflow-scrolling: touch;
  animation: slide-in 240ms cubic-bezier(0.22, 1, 0.36, 1);

  @keyframes slide-in {
    from {
      transform: translateX(${({ $side }) => ($side === 'left' ? '-100%' : '100%')});
    }
    to {
      transform: translateX(0);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--app-primary);
    outline-offset: -2px;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Header = styled.header`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--app-border);
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
`;

export const CloseButton = styled.button`
  display: flex;
  width: 2rem;
  height: 2rem;
  flex: none;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: var(--app-surface-muted);
  color: var(--app-text);
  cursor: pointer;

  &:hover {
    background: var(--app-border);
  }

  &:focus-visible {
    outline: 2px solid var(--app-primary);
    outline-offset: 2px;
  }
`;

export const Body = styled.div`
  flex: 1 1 auto;
  padding: 1.25rem;
`;
