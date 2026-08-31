import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ConfirmModal } from './ConfirmModal';

const baseProps = {
  title: 'Delete contact?',
  message: 'This cannot be undone.',
  onConfirm: () => {},
  onCancel: () => {},
};

describe('ConfirmModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<ConfirmModal {...baseProps} isOpen={false} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the title and message when open', () => {
    render(<ConfirmModal {...baseProps} isOpen />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Delete contact?')).toBeInTheDocument();
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
  });

  it('names and describes itself from the title and message', () => {
    render(<ConfirmModal {...baseProps} isOpen />);

    const dialog = screen.getByRole('dialog', { name: 'Delete contact?' });
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.');
  });

  it('calls onConfirm when the confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(<ConfirmModal {...baseProps} isOpen confirmLabel="Delete" onConfirm={onConfirm} />);

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<ConfirmModal {...baseProps} isOpen cancelLabel="Keep" onCancel={onCancel} />);

    fireEvent.click(screen.getByRole('button', { name: 'Keep' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the backdrop is clicked', () => {
    const onCancel = vi.fn();
    render(<ConfirmModal {...baseProps} isOpen onCancel={onCancel} />);

    const backdrop = screen.getByRole('dialog').parentElement as HTMLElement;
    fireEvent.click(backdrop);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('does not call onCancel when the dialog body is clicked', () => {
    const onCancel = vi.fn();
    render(<ConfirmModal {...baseProps} isOpen onCancel={onCancel} />);

    fireEvent.click(screen.getByRole('dialog'));

    expect(onCancel).not.toHaveBeenCalled();
  });

  it('has no close button — the two actions are the way out', () => {
    render(<ConfirmModal {...baseProps} isOpen />);

    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('uses the danger button for a destructive confirm', () => {
    render(<ConfirmModal {...baseProps} isOpen variant="danger" confirmLabel="Delete" />);

    expect(screen.getByRole('button', { name: 'Delete' })).toHaveAttribute(
      'data-variant',
      'danger',
    );
  });

  // The behaviour below comes from Modal, and is exactly what the hand-rolled
  // ConfirmDialog was missing.
  it('cancels on Escape', () => {
    const onCancel = vi.fn();
    render(<ConfirmModal {...baseProps} isOpen onCancel={onCancel} />);

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('starts with focus on cancel, not on the destructive action', () => {
    render(
      <ConfirmModal {...baseProps} isOpen variant="danger" confirmLabel="Delete" />,
    );

    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  });

  it('keeps Tab inside the dialog', () => {
    render(<ConfirmModal {...baseProps} isOpen confirmLabel="Delete" />);

    const cancel = screen.getByRole('button', { name: 'Cancel' });
    const confirm = screen.getByRole('button', { name: 'Delete' });

    confirm.focus();
    fireEvent.keyDown(confirm, { key: 'Tab' });
    expect(cancel).toHaveFocus();

    fireEvent.keyDown(cancel, { key: 'Tab', shiftKey: true });
    expect(confirm).toHaveFocus();
  });

  it('locks page scrolling while open', () => {
    document.body.style.overflow = 'scroll';

    const { rerender } = render(<ConfirmModal {...baseProps} isOpen />);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<ConfirmModal {...baseProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('scroll');
  });
});
