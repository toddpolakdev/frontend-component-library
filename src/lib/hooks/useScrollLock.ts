import { useEffect } from 'react';

/**
 * Stops the page behind an overlay from scrolling while `active`.
 *
 * The source's SideBar used `body-scroll-lock` for this and released with
 * `clearAllBodyScrollLocks()`, which drops every lock on the page — so closing
 * one overlay unlocked the page underneath another that was still open. Saving
 * and restoring the previous value keeps nesting honest, and needs no dependency.
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) {
      return;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}
