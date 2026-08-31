import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Drawer } from './Drawer';

describe('Drawer', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Drawer isOpen={false} onClose={() => {}} label="Basket">
        Hidden
      </Drawer>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders its children in a named dialog', () => {
    render(
      <Drawer isOpen onClose={() => {}} label="Basket">
        Two items
      </Drawer>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Basket' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Two items')).toBeInTheDocument();
  });

  it('takes its name from a visible title', () => {
    render(
      <Drawer isOpen onClose={() => {}} title="Your basket">
        Two items
      </Drawer>,
    );

    expect(screen.getByRole('dialog', { name: 'Your basket' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Your basket' })).toBeInTheDocument();
  });

  it('slides in from the right by default, and from either side on request', () => {
    const { rerender } = render(
      <Drawer isOpen onClose={() => {}} label="Filters">
        Content
      </Drawer>,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('data-side', 'right');

    rerender(
      <Drawer isOpen onClose={() => {}} label="Filters" side="left">
        Content
      </Drawer>,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('data-side', 'left');
  });

  it('closes from the close button', () => {
    const onClose = vi.fn();
    render(
      <Drawer isOpen onClose={onClose} label="Basket">
        Content
      </Drawer>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape, unless told not to', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Drawer isOpen onClose={onClose} label="Basket">
        Content
      </Drawer>,
    );

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <Drawer isOpen onClose={onClose} label="Basket" dismissOnEscape={false}>
        Content
      </Drawer>,
    );
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on a backdrop click, unless told not to', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Drawer isOpen onClose={onClose} label="Basket">
        Content
      </Drawer>,
    );

    fireEvent.click(screen.getByRole('presentation'));
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <Drawer isOpen onClose={onClose} label="Basket" dismissOnBackdrop={false}>
        Content
      </Drawer>,
    );
    fireEvent.click(screen.getByRole('presentation'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('locks page scrolling while open and restores it after', () => {
    document.body.style.overflow = 'scroll';

    const { rerender } = render(
      <Drawer isOpen onClose={() => {}} label="Basket">
        Content
      </Drawer>,
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Drawer isOpen={false} onClose={() => {}} label="Basket">
        Content
      </Drawer>,
    );
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('moves focus in and does not use a positive tabindex', () => {
    // The source set tabIndex={1} on its root, jumping the panel ahead of
    // everything else on the page in tab order.
    render(
      <Drawer isOpen onClose={() => {}} label="Basket" showClose={false}>
        <button type="button">First</button>
      </Drawer>,
    );

    expect(screen.getByRole('dialog')).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
  });

  it('hands focus back to the trigger on close', () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open basket
          </button>
          <Drawer isOpen={open} onClose={() => setOpen(false)} label="Basket">
            Content
          </Drawer>
        </>
      );
    }

    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Open basket' });

    trigger.focus();
    fireEvent.click(trigger);
    expect(trigger).not.toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(trigger).toHaveFocus();
  });

  it('keeps Tab inside the panel', () => {
    render(
      <Drawer isOpen onClose={() => {}} label="Basket" showClose={false}>
        <button type="button">First</button>
        <button type="button">Last</button>
      </Drawer>,
    );

    const first = screen.getByRole('button', { name: 'First' });
    const last = screen.getByRole('button', { name: 'Last' });

    last.focus();
    fireEvent.keyDown(last, { key: 'Tab' });
    expect(first).toHaveFocus();

    fireEvent.keyDown(first, { key: 'Tab', shiftKey: true });
    expect(last).toHaveFocus();
  });

  it('can drop its header entirely', () => {
    render(
      <Drawer isOpen onClose={() => {}} label="Basket" showClose={false}>
        Content
      </Drawer>,
    );

    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
