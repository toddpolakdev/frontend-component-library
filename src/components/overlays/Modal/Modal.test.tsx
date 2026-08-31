import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from './Modal';

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}} label="Details">
        Hidden
      </Modal>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders its children in a named dialog', () => {
    render(
      <Modal isOpen onClose={() => {}} label="Details">
        Body copy
      </Modal>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Details' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Body copy')).toBeInTheDocument();
  });

  it('can take its name from an element inside it', () => {
    render(
      <Modal isOpen onClose={() => {}} labelledBy="modal-heading">
        <h2 id="modal-heading">Order summary</h2>
      </Modal>,
    );

    expect(screen.getByRole('dialog', { name: 'Order summary' })).toBeInTheDocument();
  });

  it('closes from the close button', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} label="Details">
        Body
      </Modal>,
    );

    // The source hung onClick on the Icon svg itself: unfocusable and unnamed.
    const close = screen.getByRole('button', { name: 'Close' });
    expect(close.tagName).toBe('BUTTON');

    fireEvent.click(close);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('can hide the close button and rename it', () => {
    const { rerender } = render(
      <Modal isOpen onClose={() => {}} label="Details" showClose={false}>
        Body
      </Modal>,
    );
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();

    rerender(
      <Modal isOpen onClose={() => {}} label="Details" closeLabel="Dismiss dialog">
        Body
      </Modal>,
    );
    expect(screen.getByRole('button', { name: 'Dismiss dialog' })).toBeInTheDocument();
  });

  it('closes on Escape, unless told not to', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Modal isOpen onClose={onClose} label="Details">
        Body
      </Modal>,
    );

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <Modal isOpen onClose={onClose} label="Details" dismissOnEscape={false}>
        Body
      </Modal>,
    );
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on a backdrop click but not on a click inside', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} label="Details">
        Body
      </Modal>,
    );

    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('presentation'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('can keep the backdrop inert', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} label="Details" dismissOnBackdrop={false}>
        Body
      </Modal>,
    );

    fireEvent.click(screen.getByRole('presentation'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('locks page scrolling while open and restores it on close', () => {
    document.body.style.overflow = 'scroll';

    const { rerender } = render(
      <Modal isOpen onClose={() => {}} label="Details">
        Body
      </Modal>,
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Modal isOpen={false} onClose={() => {}} label="Details">
        Body
      </Modal>,
    );
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('moves focus to the first focusable thing inside', () => {
    render(
      <Modal isOpen onClose={() => {}} label="Details" showClose={false}>
        <button type="button">First</button>
        <button type="button">Second</button>
      </Modal>,
    );

    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
  });

  it('focuses the dialog itself when nothing inside can take focus', () => {
    render(
      <Modal isOpen onClose={() => {}} label="Details" showClose={false}>
        Just text
      </Modal>,
    );

    expect(screen.getByRole('dialog')).toHaveFocus();
  });

  it('hands focus back to the trigger on close', () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open
          </button>
          <Modal isOpen={open} onClose={() => setOpen(false)} label="Details">
            Body
          </Modal>
        </>
      );
    }

    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Open' });

    trigger.focus();
    fireEvent.click(trigger);
    expect(trigger).not.toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(trigger).toHaveFocus();
  });

  it('keeps Tab inside the dialog', () => {
    render(
      <Modal isOpen onClose={() => {}} label="Details" showClose={false}>
        <button type="button">First</button>
        <button type="button">Last</button>
      </Modal>,
    );

    const first = screen.getByRole('button', { name: 'First' });
    const last = screen.getByRole('button', { name: 'Last' });

    // Forward off the end wraps to the start.
    last.focus();
    fireEvent.keyDown(last, { key: 'Tab' });
    expect(first).toHaveFocus();

    // Backward off the start wraps to the end.
    fireEvent.keyDown(first, { key: 'Tab', shiftKey: true });
    expect(last).toHaveFocus();
  });

  it('leaves Tab alone in the middle of the dialog', () => {
    render(
      <Modal isOpen onClose={() => {}} label="Details" showClose={false}>
        <button type="button">First</button>
        <button type="button">Middle</button>
        <button type="button">Last</button>
      </Modal>,
    );

    const middle = screen.getByRole('button', { name: 'Middle' });
    middle.focus();
    fireEvent.keyDown(middle, { key: 'Tab' });

    // The browser handles the ordinary case; the trap only catches the edges.
    expect(middle).toHaveFocus();
  });
});
