import { useId, type HTMLAttributes, type ReactNode } from 'react';

import { ActionSlot, Bar, Description, Title } from './FeatureBar.styles';

export interface FeatureBarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  title: string;
  description?: string;
  /** Usually the button that dismisses or accepts — e.g. a cookie notice. */
  action?: ReactNode;
  /** Slide it out of view. */
  hide?: boolean;
}

/**
 * A fixed bar across the bottom of the page — cookie notices, promos, and other
 * page-level announcements.
 *
 * Announced as a labelled region so it can be found and skipped, rather than
 * being an anonymous div at the end of the document.
 */
export function FeatureBar({
  title,
  description,
  action,
  hide = false,
  ...rest
}: FeatureBarProps) {
  const titleId = useId();

  return (
    <Bar
      {...rest}
      $hide={hide}
      role="region"
      aria-labelledby={titleId}
      // Keeps a hidden bar out of the tab order and the a11y tree. Opacity alone
      // would leave its action button focusable and announced.
      style={{ visibility: hide ? 'hidden' : 'visible' }}
    >
      <Title id={titleId}>{title}</Title>
      {description ? <Description>{description}</Description> : null}
      {action ? <ActionSlot>{action}</ActionSlot> : null}
    </Bar>
  );
}

FeatureBar.displayName = 'FeatureBar';

export default FeatureBar;
