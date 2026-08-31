import type { ElementType, HTMLAttributes, ReactNode } from 'react';

import { ContainerRoot } from './Container.styles';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  /** Element to render. */
  as?: ElementType;
  /** Run edge to edge instead of centring within `maxWidth`. */
  fullWidth?: boolean;
  /** Content width cap when not `fullWidth`. */
  maxWidth?: string;
}

/**
 * Centres page content within a maximum width, with consistent gutters.
 *
 * The source's equivalent had `clean` for the same thing as `fullWidth` — named
 * so unclearly that it carried a `// Full Width Screen` comment to explain
 * itself — and typed its element prop as `HTMLElement | string`, which describes
 * a DOM node rather than a component type. It also applied a theme-variant class
 * from a stylesheet that only ever contained an empty `.root`.
 */
export function Container({
  children,
  as = 'div',
  fullWidth = false,
  maxWidth = '1920px',
  ...rest
}: ContainerProps) {
  return (
    <ContainerRoot {...rest} as={as} $fullWidth={fullWidth} $maxWidth={maxWidth}>
      {children}
    </ContainerRoot>
  );
}

Container.displayName = 'Container';

export default Container;
