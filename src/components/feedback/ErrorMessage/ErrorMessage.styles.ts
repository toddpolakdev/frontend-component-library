import styled from 'styled-components';

/**
 * The source's classes were written without the package's `ne-` Tailwind prefix
 * (`flex flex-col text-red py-2.5 px-4 border border-solid border-red`), so none
 * of them matched a generated utility and the component rendered with no styling
 * at all — no red, no border, no padding.
 */
export const ErrorRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.625rem 1rem;
  border: 1px solid var(--app-danger);
  border-radius: 8px;
  color: var(--app-danger);
`;

export const Details = styled.ul`
  margin: 0;
  padding-left: 1.25rem;
  list-style: disc;
`;
