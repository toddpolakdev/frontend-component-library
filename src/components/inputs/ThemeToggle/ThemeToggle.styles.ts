import styled from 'styled-components';

export const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid var(--app-border);
  border-radius: 999px;
  background: var(--app-surface);
  color: var(--app-text-soft);
  cursor: pointer;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.55rem 0.8rem;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease,
    transform 160ms ease;

  &:hover {
    border-color: var(--app-border-strong);
    background: var(--app-surface-soft);
    color: var(--app-text);
    transform: translateY(-1px);
  }

  svg {
    flex: 0 0 auto;
  }

  &:disabled {
    cursor: default;
    opacity: 0.75;
    transform: none;
  }
`;
