import styled from 'styled-components';

export const Field = styled.div`
  margin-bottom: 24px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: var(--app-text);
  font-weight: 700;
`;

export const Input = styled.input`
  width: 100%;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid var(--app-border-strong);
  border-radius: 10px;
  background: var(--app-surface);
  color: var(--app-text);
  font: inherit;

  &::placeholder {
    color: var(--app-muted);
  }

  &:focus {
    border-color: var(--app-primary);
    outline: 3px solid color-mix(in srgb, var(--app-primary) 22%, transparent);
  }
`;
