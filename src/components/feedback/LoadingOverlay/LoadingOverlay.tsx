import type { HTMLAttributes, ReactNode } from 'react';

import { Overlay, Spinner, VisuallyHidden } from './LoadingOverlay.styles';

export interface LoadingOverlayProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Replaces the default spinner. */
  children?: ReactNode;
  /** Announced while the overlay is up. */
  label?: string;
  /**
   * Cover the nearest positioned ancestor instead of the viewport — for a busy
   * state on a single card or panel.
   */
  contained?: boolean;
}

/**
 * A translucent busy veil over content that is being updated.
 *
 * Distinct from PageLoader, which is a branded splash for an initial page load:
 * this one sits over content the user can still see, for the stretch while a
 * mutation or refetch is in flight.
 *
 * The source announced nothing at all — no role, no label — so a screen-reader
 * user got silence while the page was busy.
 */
export function LoadingOverlay({
  children,
  label = 'Loading',
  contained = false,
  ...rest
}: LoadingOverlayProps) {
  return (
    <Overlay
      {...rest}
      $contained={contained}
      data-contained={contained || undefined}
      role="status"
      aria-live="polite"
    >
      {children ?? <Spinner data-spinner aria-hidden="true" />}
      {label ? <VisuallyHidden>{label}</VisuallyHidden> : null}
    </Overlay>
  );
}

LoadingOverlay.displayName = 'LoadingOverlay';

export default LoadingOverlay;
