import { useCallback, useEffect, type KeyboardEvent, type RefObject } from 'react';

/** Everything that can hold focus inside the trapped container. */
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

/**
 * Keeps focus inside a container while it's active, and hands it back afterwards.
 *
 * Anything claiming `aria-modal` has to do this, so Modal and Drawer share one
 * implementation rather than each carrying its own copy.
 *
 * Returns a keydown handler to spread onto the container. It only intercepts Tab
 * at the two ends of the focus order — the browser handles every step in
 * between — leaving the caller free to handle other keys such as Escape.
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
): (event: KeyboardEvent<HTMLElement>) => void {
  useEffect(() => {
    if (!active) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const container = ref.current;
    const first = container?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? container)?.focus();

    return () => {
      previouslyFocused?.focus?.();
    };
  }, [active, ref]);

  return useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== 'Tab') {
        return;
      }

      const container = ref.current;
      if (!container) {
        return;
      }

      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) {
        // Nothing to move to, so hold focus here rather than letting Tab walk out
        // into the page behind.
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === first || activeElement === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [ref],
  );
}
