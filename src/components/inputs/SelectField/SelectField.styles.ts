import styled from 'styled-components';

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/**
 * `$visuallyHidden` keeps the label in the accessibility tree while taking it out
 * of the layout — for selects that read clearly from context, like a sort control
 * in a toolbar. It is never simply omitted: a select with no label has no
 * accessible name at all, which is the state the source's DropdownSelect shipped
 * in.
 */
export const Label = styled.label<{ $visuallyHidden?: boolean }>`
  color: var(--app-text);
  font-weight: 700;

  ${({ $visuallyHidden }) =>
    $visuallyHidden &&
    `
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
      border: 0;
    `}
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
