import { useRef, type ReactNode } from 'react';

import { useClickOutside } from '../../../lib/hooks/useClickOutside';
import { Wrapper } from './ClickOutside.styles';

export interface ClickOutsideProps {
  /**
   * Fired when a pointer goes down outside these children. Named for what it
   * does — the source called it `onClick`, which read as "clicked me".
   */
  onClickOutside: (event: MouseEvent | TouchEvent) => void;
  /** Listen only while true, so an open/closed parent can gate it. */
  active?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Detects pointer-downs outside its children — for dismissing menus, popovers
 * and flyouts.
 *
 * Wraps the `useClickOutside` hook, which is the primitive to reach for when you
 * already have a ref to the element in question.
 */
export function ClickOutside({
  onClickOutside,
  active = true,
  children,
  className,
}: ClickOutsideProps) {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, onClickOutside, active);

  return (
    <Wrapper ref={ref} className={className}>
      {children}
    </Wrapper>
  );
}

ClickOutside.displayName = 'ClickOutside';

export default ClickOutside;
