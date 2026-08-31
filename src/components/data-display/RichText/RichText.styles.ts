import styled from 'styled-components';

import { proseStyles } from '../Text/Text.styles';

/**
 * A div, never a `<p>`.
 *
 * The source rendered markdown output inside a paragraph, but markdown emits
 * block elements — and `<p><ul>` is invalid, so browsers close the outer `<p>`
 * at the first block tag. That silently broke the DOM structure and left every
 * element after the first sibling to the container rather than inside it, which
 * detached the styling too.
 *
 * Prose rules come from Text, the one place they're defined.
 */
export const Prose = styled.div`
  color: var(--app-text);
  line-height: 1.75rem;

  ${proseStyles}
`;
