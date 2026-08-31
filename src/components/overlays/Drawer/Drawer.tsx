import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';

import { Icon } from '../../data-display';
import { useFocusTrap } from '../../../lib/hooks/useFocusTrap';
import { useScrollLock } from '../../../lib/hooks/useScrollLock';
import {
  Backdrop,
  Body,
  CloseButton,
  Header,
  Panel,
  Title,
  type DrawerSide,
} from './Drawer.styles';

export type { DrawerSide };

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Heading shown in the drawer's own header bar. */
  title?: string;
  /** Accessible name, when there's no visible `title`. */
  label?: string;
  /** Edge to slide in from. */
  side?: DrawerSide;
  /** Panel width — a max-width, so it still fits narrow screens. */
  width?: string;
  showClose?: boolean;
  closeLabel?: string;
  dismissOnBackdrop?: boolean;
  dismissOnEscape?: boolean;
  className?: string;
}

/**
 * A modal panel that slides in from the side — carts, filters, nav menus.
 *
 * Rebuilt from the source's `SideBar`, which had the shape of a drawer but none
 * of the behaviour: no dialog role, no focus trap, no focus restore, and
 * `tabIndex={1}` on its root, a positive tabindex that jumps the panel ahead of
 * everything else on the page in tab order.
 *
 * It also rendered `SwatchTooltipController` and `SecondaryFlyoutController`
 * inside itself unconditionally, and read `sidebarView === 'SWATCH_VIEW'` from a
 * global UI context to choose its width. Those are the host app's business; the
 * width is a prop and the content is whatever you pass as children.
 *
 * Shares its focus trap and scroll lock with Modal via `useFocusTrap` and
 * `useScrollLock`, so there's one implementation of each to get right.
 */
export function Drawer({
  isOpen,
  onClose,
  children,
  title,
  label,
  side = 'right',
  width = '28rem',
  showClose = true,
  closeLabel = 'Close',
  dismissOnBackdrop = true,
  dismissOnEscape = true,
  className,
}: DrawerProps) {
  const panelRef = useRef<HTMLElement>(null);
  const titleId = useId();

  useScrollLock(isOpen);
  const trapTab = useFocusTrap(panelRef, isOpen);

  if (!isOpen) {
    return null;
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape' && dismissOnEscape) {
      event.stopPropagation();
      onClose();
      return;
    }

    trapTab(event);
  };

  return (
    <>
      <Backdrop role="presentation" onClick={dismissOnBackdrop ? onClose : undefined} />

      <Panel
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title ? undefined : label}
        aria-labelledby={title ? titleId : undefined}
        className={className}
        $side={side}
        $width={width}
        data-side={side}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        {title || showClose ? (
          <Header>
            {title ? <Title id={titleId}>{title}</Title> : <span />}

            {showClose ? (
              <CloseButton type="button" onClick={onClose} aria-label={closeLabel}>
                <Icon variant="Cross" size={20} />
              </CloseButton>
            ) : null}
          </Header>
        ) : null}

        <Body>{children}</Body>
      </Panel>
    </>
  );
}

Drawer.displayName = 'Drawer';

export default Drawer;
