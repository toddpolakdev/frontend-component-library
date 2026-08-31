import { useEffect, useRef, type RefObject } from 'react';

/**
 * Calls back when a pointer goes down anywhere outside `ref`.
 *
 * This is the primitive; the ClickOutside component is a thin wrapper over it for
 * when you'd rather not manage a ref yourself.
 *
 * Replaces the source's two untyped `.js` helpers. `has-parent.js` did
 * `root.contains(element) && isInDOM(element)`, and `is-in-dom.js` tested
 * `Boolean(obj.closest('body'))` — which throws on any event target that isn't an
 * Element, since `closest` doesn't exist on text nodes or on `document`.
 * `Node.isConnected` answers the same question for every node type.
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onClickOutside: (event: MouseEvent | TouchEvent) => void,
  active = true,
): void {
  // Held in a ref so a fresh inline callback doesn't resubscribe every render —
  // the source passed no dependency array at all, so it detached and reattached
  // both listeners on every single render.
  const handler = useRef(onClickOutside);
  handler.current = onClickOutside;

  useEffect(() => {
    if (!active) {
      return;
    }

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;
      const { target } = event;

      if (!element || !(target instanceof Node)) {
        return;
      }

      // A target that has already left the document tells us nothing about
      // inside vs outside — e.g. a menu item that unmounted on mousedown.
      if (!target.isConnected) {
        return;
      }

      if (element.contains(target)) {
        return;
      }

      handler.current(event);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [active, ref]);
}
