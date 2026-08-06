import styled from 'styled-components';

export const Text = styled.span`
  display: inline;
`;

export const Highlight = styled.mark`
  margin: 0;
  padding: 0;
  border-radius: 0.15rem;
  background: var(--app-highlight);
  color: inherit;
  font: inherit;
  line-height: inherit;
  box-shadow: 0 0 0 1px var(--app-highlight);
`;
