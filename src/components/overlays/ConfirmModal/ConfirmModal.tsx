import { useId } from 'react';

import { PrimaryButton } from '../../inputs';
import { Modal } from '../Modal';
import { Actions, Message, Title } from './ConfirmModal.styles';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * A yes/no prompt, built on Modal.
 *
 * Previously ConfirmDialog, which hand-rolled its own backdrop and dialog. That
 * left it claiming `aria-modal` without honouring it — no focus trap, no focus
 * restore, no Escape, no scroll lock. Composing Modal means there's one dialog
 * implementation to get right, and this only supplies the prompt itself.
 *
 * Focus lands on Cancel, which is the safe default for a destructive confirm.
 */
export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const messageId = `${baseId}-message`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      labelledBy={titleId}
      describedBy={messageId}
      showClose={false}
      maxWidth="28rem"
    >
      <Title id={titleId}>{title}</Title>
      <Message id={messageId}>{message}</Message>

      <Actions>
        <PrimaryButton variant="secondary" fullWidthOnMobile={false} onClick={onCancel}>
          {cancelLabel}
        </PrimaryButton>

        <PrimaryButton
          variant={variant === 'danger' ? 'danger' : 'primary'}
          fullWidthOnMobile={false}
          onClick={onConfirm}
        >
          {confirmLabel}
        </PrimaryButton>
      </Actions>
    </Modal>
  );
}

ConfirmModal.displayName = 'ConfirmModal';

export default ConfirmModal;
