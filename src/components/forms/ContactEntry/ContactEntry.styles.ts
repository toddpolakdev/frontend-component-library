import styled, { css } from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  align-items: start;

  > * {
    min-width: 0;
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 0.9rem;
  }
`;

export const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

export const CategoryField = styled.div`
  max-width: 12rem;
`;

export const PhoneField = styled.div`
  max-width: 14rem;

  @media (max-width: 700px) {
    max-width: none;
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

export const Form = styled.form<{ $compact: boolean }>`
  margin-bottom: 28px;
  padding: 24px;
  border: 1px solid var(--app-border);
  border-radius: 16px;
  background: var(--app-surface-soft);

  @media (max-width: 700px) {
    padding: 1rem;
  }

  ${(props) =>
    props.$compact &&
    css`
      margin-bottom: 0;
      padding: 1rem;

      ${Grid} {
        gap: 0.85rem;
      }

      ${CategoryField} {
        max-width: 10rem;
      }

      ${PhoneField} {
        max-width: 12rem;
      }

      ${Actions} {
        gap: 0.65rem;
        margin-top: 1rem;
      }

      & input,
      & select,
      & textarea {
        min-height: 2.5rem;
        padding: 0.6rem 0.75rem;
        font-size: 0.95rem;
      }

      @media (max-width: 700px) {
        padding: 0.85rem;

        ${Grid} {
          gap: 0.75rem;
        }

        ${Actions} {
          flex-direction: row;
        }

        ${Actions} > * {
          flex: 1;
        }
      }
    `}
`;
