import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react';

import { StyledText, type TextVariant } from './Text.styles';

export type { TextVariant };

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Which step of the type scale to render. */
  variant?: TextVariant;
  /**
   * Render a different element without changing the look — `variant` picks the
   * appearance, `as` picks the semantics. Needed because two variants default to
   * `h1`: a page with both would otherwise emit two top-level headings.
   */
  as?: ElementType;
  children?: ReactNode;
}

/** The element each variant renders when `as` isn't given. */
const defaultElement: Record<TextVariant, ElementType> = {
  heading: 'h1',
  pageHeading: 'h1',
  sectionHeading: 'h2',
  // A div, not a p: body is allowed to wrap block content (lists, headings),
  // which a <p> cannot legally contain.
  body: 'div',
};

/**
 * The typography primitive.
 *
 * The source component also took an `html` string and pushed it through
 * `dangerouslySetInnerHTML` with no sanitising. Nothing in the source app used
 * it, so it isn't carried over — pass children instead, and use a dedicated
 * rich-text component for CMS-authored HTML.
 */
export const Text = forwardRef<HTMLElement, TextProps>(
  ({ variant = 'body', as, children, ...rest }, ref) => (
    <StyledText
      {...rest}
      ref={ref}
      as={as ?? defaultElement[variant]}
      data-variant={variant}
      $variant={variant}
    >
      {children}
    </StyledText>
  ),
);

Text.displayName = 'Text';

export default Text;
