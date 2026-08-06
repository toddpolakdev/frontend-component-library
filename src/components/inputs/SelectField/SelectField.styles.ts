import styled from 'styled-components';

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  color: var(--app-text);
  font-weight: 700;
`;

export const RequiredMark = styled.span`
  color: var(--app-danger);
`;

export const Select = styled.select<{ $hasError: boolean }>`
  width: 100%;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid ${(props) => (props.$hasError ? 'var(--app-danger)' : 'var(--app-border-strong)')};
  border-radius: 10px;
  background: var(--app-surface);
  color: var(--app-text);
  font: inherit;

  &:focus {
    border-color: ${(props) => (props.$hasError ? 'var(--app-danger)' : 'var(--app-primary)')};
    outline: 3px solid
      ${(props) =>
        props.$hasError
          ? 'color-mix(in srgb, var(--app-danger) 15%, transparent)'
          : 'color-mix(in srgb, var(--app-primary) 15%, transparent)'};
  }
`;

export const ErrorText = styled.p`
  margin: 0;
  color: var(--app-danger);
  font-size: 0.9rem;
`;
