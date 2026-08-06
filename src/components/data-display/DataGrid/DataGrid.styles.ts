import styled, { css } from 'styled-components';

export type DataGridColumnKey = string;

const mobileCardColumns = ['phone', 'company', 'category', 'actions'];

export const GridTable = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--app-border);
  border-radius: 14px;
  background: var(--app-surface);

  @media (max-width: 700px) {
    overflow-x: visible;
    border: 0;
    border-radius: 0;
    background: transparent;
  }
`;

export const HeaderRow = styled.div`
  min-width: 58rem;
  display: grid;
  align-items: center;
  background: var(--app-surface-muted);

  @media (max-width: 700px) {
    display: none;
  }
`;

export const Row = styled.div<{ $active: boolean }>`
  display: grid;
  align-items: center;
  border-top: 1px solid var(--app-border);
  transition: background-color 160ms ease;

  @media (max-width: 700px) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.7rem;
    padding: 1rem;
    border-top: 0;
  }
`;

export const Body = styled.div`
  min-width: 58rem;

  @media (max-width: 700px) {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }
`;

export const RowGroup = styled.div`
  &:nth-child(odd) ${Row} {
    background: var(--app-surface);
  }
  &:nth-child(even) ${Row} {
    background: var(--app-surface-soft);
  }
  ${Row}:hover {
    background: var(--app-primary-soft);
  }
  ${Row}[data-active='true'],
  ${Row}[data-active='true']:hover {
    background: var(--app-surface-muted);
  }

  @media (max-width: 700px) {
    overflow: hidden;
    border: 1px solid var(--app-border);
    border-radius: 1rem;
    background: var(--app-surface);
  }
`;

const centerCell = css`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const HeaderCell = styled.div<{ $center: boolean }>`
  min-width: 0;
  padding: 14px;
  color: var(--app-muted);
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  ${(props) => props.$center && centerCell}
`;

export const Cell = styled.div<{ $center: boolean; $column: DataGridColumnKey }>`
  min-width: 0;
  padding: 14px;
  color: var(--app-text);
  ${(props) => props.$center && centerCell}

  @media (max-width: 700px) {
    padding: 0;

    &::before {
      content: attr(data-label);
      display: block;
      margin-bottom: 0.25rem;
      color: var(--app-muted);
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    ${(props) => props.$center && css`
      text-align: left;
    `}

    ${(props) =>
      props.$column === 'contact' &&
      css`
        &::before {
          display: none;
        }
      `}

    ${(props) =>
      mobileCardColumns.includes(props.$column) &&
      css`
        display: grid;
        grid-template-columns: 5.25rem minmax(0, 1fr);
        align-items: center;
        column-gap: 0.75rem;

        &::before {
          margin-bottom: 0;
        }
      `}

    ${(props) =>
      props.$column === 'category' &&
      css`
        grid-template-columns: 5.25rem max-content;
        justify-content: start;

        & > * {
          justify-self: start;
          width: fit-content;
          max-width: max-content;
        }
      `}
  }
`;

export const SortButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: inherit;
  gap: 0.35rem;
  width: 100%;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  text-align: inherit;
  text-transform: inherit;
  padding: 0;

  &:hover {
    color: var(--app-primary);
  }

  &:focus-visible {
    outline: 3px solid color-mix(in srgb, var(--app-primary) 24%, transparent);
    outline-offset: 3px;
    border-radius: 0.35rem;
  }
`;

export const SortIndicator = styled.span`
  color: var(--app-muted);
  font-size: 0.8rem;
`;

export const ExpandedRow = styled.div`
  border-top: 1px solid var(--app-border);
  padding: 16px;
  background: var(--app-surface-muted);

  @media (max-width: 700px) {
    padding: 0;
  }
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const PaginationText = styled.p`
  margin: 0;
  color: var(--app-muted);
  font-size: 0.9rem;
`;

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 700px) {
    justify-content: space-between;
  }
`;

export const PaginationButton = styled.button`
  border: 1px solid var(--app-border-strong);
  border-radius: 999px;
  background: var(--app-surface);
  color: var(--app-text);
  padding: 0.55rem 0.9rem;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease;

  &:hover:not(:disabled) {
    border-color: var(--app-primary);
    background: var(--app-primary-soft);
    color: var(--app-primary);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (max-width: 700px) {
    flex: 1;
  }
`;

export const PageIndicator = styled.span`
  color: var(--app-muted);
  font-size: 0.9rem;
  font-weight: 700;

  @media (max-width: 700px) {
    text-align: center;
  }
`;
