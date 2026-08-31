import { useRef, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';

import { Icon } from '../../data-display';
import { useFocusTrap } from '../../../lib/hooks/useFocusTrap';
import { useScrollLock } from '../../../lib/hooks/useScrollLock';
import { Backdrop, Body, CloseButton, Dialog } from './Modal.styles';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Accessible name for the dialog. Use this or `labelledBy`. */
  label?: string;
  /** Id of an element inside the modal that names it — usually its heading. */
  labelledBy?: string;
  /** Id of an element inside the modal that describes it — usually its body copy. */
  describedBy?: string;
  /** Cap on the dialog's width. */
  maxWidth?: string;
  showClose?: boolean;
  closeLabel?: string;
  /** Clicking the scrim dismisses. */
  dismissOnBackdrop?: boolean;
  /** Escape dismisses. */
  dismissOnEscape?: boolean;
  className?: string;
}

/**
 * A generic modal dialog.
 *
 * Renamed from the source's `ModalView`, and given the behaviour a modal needs:
 * it claims `aria-modal`, so it has to actually keep focus inside, hand focus
 * back on close, and answer Escape. The source was a bare div — no scrim, no
 * dialog role, no focus handling, no keyboard route out.
 *
 * Deliberately not built on the native `<dialog>` element: that would be the
 * better implementation, but jsdom doesn't implement `showModal()`, and stubbing
 * it would mean testing a fake instead of the focus trap and Escape handling.
 */
export function Modal({
  isOpen,
  onClose,
  children,
  label,
  labelledBy,
  describedBy,
  maxWidth = '56rem',
  showClose = true,
  closeLabel = 'Close',
  dismissOnBackdrop = true,
  dismissOnEscape = true,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useScrollLock(isOpen);
  const trapTab = useFocusTrap(dialogRef, isOpen);

  if (!isOpen) {
    return null;
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && dismissOnEscape) {
      event.stopPropagation();
      onClose();
      return;
    }

    trapTab(event);
  };

  return (
    <Backdrop
      role="presentation"
      onClick={dismissOnBackdrop ? onClose : undefined}
      onKeyDown={handleKeyDown}
    >
      <Dialog
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={labelledBy ? undefined : label}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        className={className}
        $maxWidth={maxWidth}
        tabIndex={-1}
        onClick={(event: MouseEvent) => event.stopPropagation()}
      >
        {showClose ? (
          <CloseButton type="button" onClick={onClose} aria-label={closeLabel}>
            <Icon variant="Cross" size={20} />
          </CloseButton>
        ) : null}

        <Body>{children}</Body>
      </Dialog>
    </Backdrop>
  );
}

Modal.displayName = 'Modal';

export default Modal;
