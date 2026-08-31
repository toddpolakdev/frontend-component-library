import { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Quantity } from './Quantity';

/** Wraps the controlled component so the value actually moves. */
function Harness({ initial = 1, ...props }: { initial?: number } & Record<string, unknown>) {
  const [value, setValue] = useState(initial);
  return <Quantity value={value} onChange={setValue} {...props} />;
}

const field = () => screen.getByRole('textbox', { name: 'Quantity' });
const decrease = () => screen.getByRole('button', { name: 'Decrease quantity' });
const increase = () => screen.getByRole('button', { name: 'Increase quantity' });

describe('Quantity', () => {
  it('shows the current value', () => {
    render(<Quantity value={4} onChange={() => {}} />);

    expect(field()).toHaveValue('4');
  });

  it('steps up and down', () => {
    const onChange = vi.fn();
    render(<Quantity value={3} onChange={onChange} />);

    fireEvent.click(increase());
    expect(onChange).toHaveBeenLastCalledWith(4);

    fireEvent.click(decrease());
    expect(onChange).toHaveBeenLastCalledWith(2);
  });

  it('stops at min and disables the decrease button there', () => {
    const onChange = vi.fn();
    render(<Quantity value={0} onChange={onChange} />);

    expect(decrease()).toBeDisabled();

    fireEvent.click(decrease());
    expect(onChange).not.toHaveBeenCalled();
  });

  it('honours a custom min', () => {
    render(<Harness initial={1} min={1} />);

    expect(decrease()).toBeDisabled();
    expect(field()).toHaveValue('1');
  });

  it('accepts only digits, up to four', () => {
    render(<Harness initial={1} />);

    fireEvent.change(field(), { target: { value: '25' } });
    expect(field()).toHaveValue('25');

    fireEvent.change(field(), { target: { value: '25abc' } });
    expect(field()).toHaveValue('25');

    fireEvent.change(field(), { target: { value: '12345' } });
    expect(field()).toHaveValue('25');
  });

  it('commits a typed value on blur and on Enter', () => {
    const onChange = vi.fn();
    render(<Quantity value={1} onChange={onChange} />);

    fireEvent.change(field(), { target: { value: '7' } });
    fireEvent.blur(field());
    expect(onChange).toHaveBeenLastCalledWith(7);

    fireEvent.change(field(), { target: { value: '9' } });
    fireEvent.keyDown(field(), { key: 'Enter' });
    expect(onChange).toHaveBeenLastCalledWith(9);
  });

  it('falls back to min when the field is cleared', () => {
    render(<Harness initial={5} min={1} />);

    fireEvent.change(field(), { target: { value: '' } });
    expect(field()).toHaveValue('');

    fireEvent.blur(field());
    expect(field()).toHaveValue('1');
  });

  it('clamps a typed value down to max', () => {
    const onChange = vi.fn();
    render(<Quantity value={1} onChange={onChange} max={3} />);

    fireEvent.change(field(), { target: { value: '99' } });
    fireEvent.blur(field());

    expect(onChange).toHaveBeenLastCalledWith(3);
  });

  it('warns instead of incrementing past max', () => {
    const onChange = vi.fn();
    render(<Quantity value={3} onChange={onChange} max={3} maxMessage="Only 3 available" />);

    fireEvent.click(increase());

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent('Only 3 available');
    expect(field()).toHaveAccessibleDescription('Only 3 available');
  });

  it('warns even when max is zero', () => {
    // The source hid the warning whenever availability was falsy, so a
    // completely unavailable item silently refused every click.
    render(<Quantity value={0} onChange={() => {}} max={0} maxMessage="Out of stock" />);

    fireEvent.click(increase());

    expect(screen.getByRole('status')).toHaveTextContent('Out of stock');
  });

  it('clears the warning after a moment', () => {
    vi.useFakeTimers();

    render(<Quantity value={3} onChange={() => {}} max={3} maxMessage="Only 3 available" />);
    fireEvent.click(increase());
    expect(screen.getByRole('status')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('disables everything when disabled', () => {
    render(<Quantity value={2} onChange={() => {}} disabled />);

    expect(field()).toBeDisabled();
    expect(decrease()).toBeDisabled();
    expect(increase()).toBeDisabled();
  });

  it('gives each instance its own input id', () => {
    // The source hardcoded id="quantity", so every cart line collided.
    render(
      <>
        <Quantity value={1} onChange={() => {}} label="First" />
        <Quantity value={1} onChange={() => {}} label="Second" />
      </>,
    );

    const first = screen.getByRole('textbox', { name: 'First' });
    const second = screen.getByRole('textbox', { name: 'Second' });

    expect(first.id).toBeTruthy();
    expect(second.id).toBeTruthy();
    expect(first.id).not.toBe(second.id);
  });

  it('takes an explicit id when given one', () => {
    render(<Quantity value={1} onChange={() => {}} id="line-item-qty" />);

    expect(field()).toHaveAttribute('id', 'line-item-qty');
  });

  it('follows the value when it changes from outside', () => {
    const { rerender } = render(<Quantity value={2} onChange={() => {}} />);
    expect(field()).toHaveValue('2');

    rerender(<Quantity value={8} onChange={() => {}} />);
    expect(field()).toHaveValue('8');
  });
});

describe('Quantity timers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not fire the warning timer after unmount', () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { unmount } = render(
      <Quantity value={3} onChange={() => {}} max={3} maxMessage="Only 3 available" />,
    );
    fireEvent.click(increase());
    unmount();

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(errors).not.toHaveBeenCalled();
    errors.mockRestore();
  });
});
