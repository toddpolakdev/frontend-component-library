import styled from 'styled-components';

export const Nav = styled.nav`
  color: var(--app-muted);
  font-size: 0.875rem;
`;

export const Trail = styled.ol`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Crumb = styled.li`
  display: flex;
  align-items: center;
`;

export const CrumbLink = styled.a`
  color: var(--app-muted);
  text-decoration: none;

  &:hover {
    color: var(--app-text);
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid var(--app-primary);
    outline-offset: 2px;
    border-radius: 3px;
  }
`;

export const Current = styled.span`
  color: var(--app-text);
`;

/**
 * Decorative, and hidden from assistive tech. The source put its separator in a
 * plain `<span>` as `&nbsp;&nbsp;/&nbsp;&nbsp;`, so screen readers announced
 * "slash" between every step.
 */
export const Separator = styled.span`
  padding: 0 0.6rem;
  color: var(--app-border-strong);
`;
