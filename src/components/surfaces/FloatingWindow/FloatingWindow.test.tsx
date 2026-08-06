import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FloatingWindow } from './FloatingWindow';

describe('FloatingWindow', () => {
  it('renders its title and content', () => {
    render(
      <FloatingWindow title="Notes" onClose={() => {}}>
        <p>Window body</p>
      </FloatingWindow>,
    );

    expect(screen.getByRole('dialog', { name: 'Notes' })).toBeInTheDocument();
    expect(screen.getByText('Window body')).toBeInTheDocument();
  });

  it('calls onClose from the close control', () => {
    const onClose = vi.fn();
    render(
      <FloatingWindow title="Notes" onClose={onClose}>
        body
      </FloatingWindow>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('only renders the minimize control when onMinimize is provided', () => {
    const onMinimize = vi.fn();
    const { rerender } = render(
      <FloatingWindow title="Notes" onClose={() => {}}>
        body
      </FloatingWindow>,
    );
    expect(screen.queryByRole('button', { name: 'Minimize' })).not.toBeInTheDocument();

    rerender(
      <FloatingWindow title="Notes" onClose={() => {}} onMinimize={onMinimize}>
        body
      </FloatingWindow>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Minimize' }));
    expect(onMinimize).toHaveBeenCalledTimes(1);
  });

  it('is hidden when minimized', () => {
    render(
      <FloatingWindow title="Notes" onClose={() => {}} minimized>
        body
      </FloatingWindow>,
    );

    expect(screen.getByRole('dialog', { hidden: true })).toHaveStyle({ display: 'none' });
  });

  it('repositions while dragging the header', () => {
    render(
      <FloatingWindow title="Notes" onClose={() => {}} initialPosition={{ x: 100, y: 100 }}>
        body
      </FloatingWindow>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Notes' });
    const header = screen.getByText('Notes').parentElement as HTMLElement;

    fireEvent.mouseDown(header, { clientX: 150, clientY: 150 });
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 200, clientY: 220 }));
    });

    expect(dialog).toHaveStyle({ left: '150px', top: '170px' });
  });
});
