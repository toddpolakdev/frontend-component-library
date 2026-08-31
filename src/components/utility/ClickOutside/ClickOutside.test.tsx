import { useRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useClickOutside } from '../../../lib/hooks/useClickOutside';
import { ClickOutside } from './ClickOutside';

describe('ClickOutside', () => {
  it('fires when a pointer goes down outside', () => {
    const onClickOutside = vi.fn();
    render(
      <div>
        <ClickOutside onClickOutside={onClickOutside}>
          <button type="button">Inside</button>
        </ClickOutside>
        <button type="button">Outside</button>
      </div>,
    );

    fireEvent.mouseDown(screen.getByRole('button', { name: 'Outside' }));

    expect(onClickOutside).toHaveBeenCalledTimes(1);
  });

  it('stays quiet for a pointer down inside', () => {
    const onClickOutside = vi.fn();
    render(
      <ClickOutside onClickOutside={onClickOutside}>
        <button type="button">Inside</button>
      </ClickOutside>,
    );

    fireEvent.mouseDown(screen.getByRole('button', { name: 'Inside' }));

    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it('responds to touch as well as mouse', () => {
    const onClickOutside = vi.fn();
    render(
      <div>
        <ClickOutside onClickOutside={onClickOutside}>
          <span>Inside</span>
        </ClickOutside>
        <span>Outside</span>
      </div>,
    );

    fireEvent.touchStart(screen.getByText('Outside'));

    expect(onClickOutside).toHaveBeenCalledTimes(1);
  });

  it('listens only while active', () => {
    const onClickOutside = vi.fn();
    const { rerender } = render(
      <div>
        <ClickOutside onClickOutside={onClickOutside} active={false}>
          <span>Inside</span>
        </ClickOutside>
        <span>Outside</span>
      </div>,
    );

    fireEvent.mouseDown(screen.getByText('Outside'));
    expect(onClickOutside).not.toHaveBeenCalled();

    rerender(
      <div>
        <ClickOutside onClickOutside={onClickOutside} active>
          <span>Inside</span>
        </ClickOutside>
        <span>Outside</span>
      </div>,
    );

    fireEvent.mouseDown(screen.getByText('Outside'));
    expect(onClickOutside).toHaveBeenCalledTimes(1);
  });

  it('ignores a target that has already left the document', () => {
    const onClickOutside = vi.fn();
    render(
      <ClickOutside onClickOutside={onClickOutside}>
        <span>Inside</span>
      </ClickOutside>,
    );

    // Stands in for an element that unmounted during the same interaction.
    const detached = document.createElement('button');
    fireEvent.mouseDown(detached);

    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it('stops listening once unmounted', () => {
    const onClickOutside = vi.fn();
    const { unmount } = render(
      <ClickOutside onClickOutside={onClickOutside}>
        <span>Inside</span>
      </ClickOutside>,
    );

    unmount();
    fireEvent.mouseDown(document.body);

    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it('accepts children the source could not clone', () => {
    const onClickOutside = vi.fn();

    // Plain text plus multiple children: React.Children.only would have thrown,
    // and there'd be no element to attach a ref to.
    render(
      <ClickOutside onClickOutside={onClickOutside}>
        Some text
        <span>and an element</span>
      </ClickOutside>,
    );

    expect(screen.getByText('Some text')).toBeInTheDocument();
    expect(screen.getByText('and an element')).toBeInTheDocument();
  });

  it('closes a menu, the job it exists for', () => {
    function Menu() {
      const [open, setOpen] = useState(true);
      return (
        <div>
          {open ? (
            <ClickOutside onClickOutside={() => setOpen(false)}>
              <ul>
                <li>Account</li>
              </ul>
            </ClickOutside>
          ) : null}
          <button type="button">Elsewhere</button>
        </div>
      );
    }

    render(<Menu />);
    expect(screen.getByRole('listitem')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole('button', { name: 'Elsewhere' }));

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });
});

describe('useClickOutside', () => {
  it('works directly against a ref you already have', () => {
    const onClickOutside = vi.fn();

    function Panel() {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, onClickOutside);
      return (
        <div>
          <div ref={ref}>
            <span>Inside</span>
          </div>
          <span>Outside</span>
        </div>
      );
    }

    render(<Panel />);

    fireEvent.mouseDown(screen.getByText('Inside'));
    expect(onClickOutside).not.toHaveBeenCalled();

    fireEvent.mouseDown(screen.getByText('Outside'));
    expect(onClickOutside).toHaveBeenCalledTimes(1);
  });

  it('sees the latest callback without resubscribing', () => {
    const first = vi.fn();
    const second = vi.fn();

    function Panel({ handler }: { handler: () => void }) {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref, handler);
      return <div ref={ref}>Inside</div>;
    }

    const { rerender } = render(<Panel handler={first} />);
    rerender(<Panel handler={second} />);

    fireEvent.mouseDown(document.body);

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
