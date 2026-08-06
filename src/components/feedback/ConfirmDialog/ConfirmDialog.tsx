import { useId, type MouseEvent } from 'react';

import { PrimaryButton } from '../../inputs';
import {
  Actions,
  Backdrop,
  Dialog,
  DialogContent,
  Message,
  Title,
} from './ConfirmDialog.styles';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();

  if (!isOpen) {
    return null;
  }

  return (
    <Backdrop role="presentation" onClick={onCancel}>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event: MouseEvent) => event.stopPropagation()}
      >
        <DialogContent>
          <Title id={titleId}>{title}</Title>
          <Message>{message}</Message>
        </DialogContent>

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
      </Dialog>
    </Backdrop>
  );
}

ConfirmDialog.displayName = 'ConfirmDialog';

export default ConfirmDialog;
