import type { HTMLAttributes } from 'react';

import { Dot, DotsRoot, VisuallyHidden } from './LoadingDots.styles';

export interface LoadingDotsProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * Announced while the dots are showing. Pass an empty string when a parent
   * already says what's loading, so it isn't announced twice.
   */
  label?: string;
}

/**
 * Three blinking dots, sized and coloured from the surrounding text
 * (`currentColor`), so it sits inside a button or a line of copy unchanged.
 */
export function LoadingDots({ label = 'Loading', ...rest }: LoadingDotsProps) {
  return (
    <DotsRoot {...rest} role="status">
      <Dot data-dot aria-hidden="true" />
      <Dot data-dot aria-hidden="true" />
      <Dot data-dot aria-hidden="true" />
      {label ? <VisuallyHidden>{label}</VisuallyHidden> : null}
    </DotsRoot>
  );
}

LoadingDots.displayName = 'LoadingDots';

export default LoadingDots;
