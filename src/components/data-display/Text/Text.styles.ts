import styled, { css } from 'styled-components';

export type TextVariant = 'heading' | 'pageHeading' | 'sectionHeading' | 'body';

/**
 * Styles for a block of authored markup — headings, lists, links.
 *
 * Exported because Text isn't the only thing that renders prose: anything that
 * turns CMS or markdown content into HTML needs the same treatment, and two
 * copies of a type scale drift apart. Text's `body` variant is one consumer.
 */
export const proseStyles = css`
  :is(h1, h2, h3, h4, h5, h6, p, ul, ol) {
    margin-bottom: 1rem;
  }

  :is(h1, h2, h3, h4, h5, h6) {
    font-weight: 600;
    letter-spacing: 0.025em;
  }

  :is(h1, h2, h3, h4, h5, h6):not(:first-child) {
    margin-top: 2rem;
  }

  h1 {
    font-size: 3rem;
  }

  h2 {
    font-size: 2.25rem;
  }

  h3 {
    font-size: 1.875rem;
  }

  h4 {
    font-size: 1.5rem;
  }

  h5 {
    font-size: 1.25rem;
  }

  h6 {
    font-size: 1.125rem;
  }

  ul,
  ol {
    padding-left: 1.5rem;
  }

  ul {
    list-style: disc;
  }

  ol {
    list-style: decimal;
  }

  a {
    color: inherit;
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }

  /* Trailing margin is the container's business, not the last child's. */
  > :last-child {
    margin-bottom: 0;
  }
`;

/**
 * Type scale ported from the source app's Tailwind classes.
 *
 * Two things were deliberately dropped. `cursor: pointer` sat on `heading` and
 * `sectionHeading` — headings aren't controls, and the pointer promised a click
 * that never existed. `body` also carried `max-width: 72rem; margin-inline:
 * auto`, i.e. page layout welded into a typography primitive; that belongs to a
 * layout container, not to the text itself.
 */
const variantStyles: Record<TextVariant, ReturnType<typeof css>> = {
  heading: css`
    padding: 0.25rem 0 0.5rem;
    margin: 0 0 0.5rem;
    font-size: 3rem;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0.025em;
  `,

  pageHeading: css`
    padding: 0.25rem 0 1rem;
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.75rem;
    letter-spacing: 0.025em;
  `,

  sectionHeading: css`
    padding: 0.25rem 0 0.5rem;
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
    font-weight: 400;
    line-height: 2rem;
    letter-spacing: 0.025em;
  `,

  /* Body also styles nested markup, so a block of CMS/WYSIWYG content dropped
     inside it reads correctly without every element needing its own class. */
  body: css`
    color: var(--app-text);
    line-height: 1.75rem;

    ${proseStyles}
  `,
};

export const StyledText = styled.div<{ $variant: TextVariant }>`
  ${({ $variant }) => variantStyles[$variant]}
`;
