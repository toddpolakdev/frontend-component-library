import styled from 'styled-components';

export const QuantityRoot = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 0.15rem;
`;

export const Controls = styled.div<{ $warning: boolean }>`
  display: inline-flex;
  align-items: stretch;
  border: 1px solid
    ${({ $warning }) => ($warning ? 'var(--app-danger)' : 'var(--app-border-strong)')};
  border-radius: 8px;
  background: var(--app-surface);
  transition: border-color 200ms ease;

  &:focus-within {
    border-color: var(--app-primary);
  }
`;

export const StepButton = styled.button`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  max-width: 36px;
  padding: 0.5rem;
  border: 0;
  background: transparent;
  color: var(--app-text);
  cursor: pointer;
  transition:
    background 200ms ease,
    opacity 200ms ease;

  &:hover:not(:disabled) {
    background: var(--app-surface-muted);
    opacity: 0.8;
  }

  &:disabled {
    color: var(--app-muted);
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:focus-visible {
    outline: 2px solid var(--app-primary);
    outline-offset: -2px;
  }
`;

export const QuantityInput = styled.input`
  width: 50px;
  height: 28px;
  align-self: center;
  border: 0;
  background: transparent;
  color: var(--app-text);
  font: inherit;
  text-align: center;

  &:focus {
    outline: none;
  }

  &:disabled {
    color: var(--app-muted);
    cursor: not-allowed;
  }
`;

export const Warning = styled.div`
  color: var(--app-danger);
  font-size: 0.75rem;
  line-height: 1rem;
`;
