import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ConfirmDialog } from './ConfirmDialog';

const baseProps = {
  title: 'Delete contact?',
  message: 'This cannot be undone.',
  onConfirm: () => {},
  onCancel: () => {},
};

describe('ConfirmDialog', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<ConfirmDialog {...baseProps} isOpen={false} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the title and message when open', () => {
    render(<ConfirmDialog {...baseProps} isOpen />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Delete contact?')).toBeInTheDocument();
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
  });

  it('calls onConfirm when the confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(<ConfirmDialog {...baseProps} isOpen confirmLabel="Delete" onConfirm={onConfirm} />);

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<ConfirmDialog {...baseProps} isOpen cancelLabel="Keep" onCancel={onCancel} />);

    fireEvent.click(screen.getByRole('button', { name: 'Keep' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the backdrop is clicked', () => {
    const onCancel = vi.fn();
    render(<ConfirmDialog {...baseProps} isOpen onCancel={onCancel} />);

    const backdrop = screen.getByRole('dialog').parentElement as HTMLElement;
    fireEvent.click(backdrop);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('does not call onCancel when the dialog body is clicked', () => {
    const onCancel = vi.fn();
    render(<ConfirmDialog {...baseProps} isOpen onCancel={onCancel} />);

    fireEvent.click(screen.getByRole('dialog'));

    expect(onCancel).not.toHaveBeenCalled();
  });
});
