import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { OptionTile } from './OptionTile';

describe('OptionTile', () => {
  it('renders its title and description', () => {
    render(<OptionTile title="Ship to store" description="Free, ready in 3 days" />);

    expect(screen.getByText('Ship to store')).toBeInTheDocument();
    expect(screen.getByText('Free, ready in 3 days')).toBeInTheDocument();
  });

  it('works without a description', () => {
    render(<OptionTile title="Ship to store" />);

    expect(screen.getByRole('button', { name: 'Ship to store' })).toBeInTheDocument();
  });

  it('is a real button, so it can be reached and pressed', () => {
    // The source was a <div onClick>: no focus, no keyboard, no role.
    render(<OptionTile title="Ship to store" />);

    const tile = screen.getByRole('button', { name: /Ship to store/ });
    expect(tile.tagName).toBe('BUTTON');
    expect(tile).toHaveAttribute('type', 'button');

    tile.focus();
    expect(tile).toHaveFocus();
  });

  it('calls onClick', () => {
    const onClick = vi.fn();
    render(<OptionTile title="Ship to store" onClick={onClick} />);

    fireEvent.click(screen.getByRole('button', { name: /Ship to store/ }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is unselected by default', () => {
    // The source's `active` defaulted to true, so every tile looked chosen.
    render(<OptionTile title="Ship to store" />);

    expect(screen.getByRole('button', { name: /Ship to store/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('announces and marks the selected state', () => {
    render(<OptionTile title="Ship to store" selected />);

    const tile = screen.getByRole('button', { name: /Ship to store/ });
    expect(tile).toHaveAttribute('aria-pressed', 'true');
    expect(tile).toHaveAttribute('data-selected');
  });

  it('defaults to the Info icon', () => {
    const { container } = render(<OptionTile title="Ship to store" />);

    expect(container.querySelector('svg')).toHaveAttribute('data-variant', 'Info');
  });

  it('takes any icon variant', () => {
    const { container } = render(<OptionTile title="Delivery" iconVariant="LocalShipping" />);

    expect(container.querySelector('svg')).toHaveAttribute('data-variant', 'LocalShipping');
  });

  it('does not fire when disabled', () => {
    const onClick = vi.fn();
    render(<OptionTile title="Ship to store" disabled onClick={onClick} />);

    const tile = screen.getByRole('button', { name: /Ship to store/ });
    expect(tile).toBeDisabled();

    fireEvent.click(tile);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('spreads DOM props', () => {
    render(<OptionTile title="Ship to store" id="tile-1" className="wide" />);

    const tile = screen.getByRole('button', { name: /Ship to store/ });
    expect(tile).toHaveAttribute('id', 'tile-1');
    expect(tile).toHaveClass('wide');
  });

  it('composes into a single-choice row', () => {
    function Choices() {
      const [chosen, setChosen] = useState('store');
      return (
        <div>
          {[
            { value: 'store', title: 'Ship to store' },
            { value: 'home', title: 'Ship to home' },
          ].map((option) => (
            <OptionTile
              key={option.value}
              title={option.title}
              selected={chosen === option.value}
              onClick={() => setChosen(option.value)}
            />
          ))}
        </div>
      );
    }

    render(<Choices />);

    expect(screen.getByRole('button', { name: /Ship to store/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    fireEvent.click(screen.getByRole('button', { name: /Ship to home/ }));

    expect(screen.getByRole('button', { name: /Ship to store/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: /Ship to home/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
