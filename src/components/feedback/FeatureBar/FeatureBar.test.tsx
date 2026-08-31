import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FeatureBar } from './FeatureBar';

describe('FeatureBar', () => {
  it('renders its title and description', () => {
    render(<FeatureBar title="We use cookies" description="To keep your basket." />);

    expect(screen.getByText('We use cookies')).toBeInTheDocument();
    expect(screen.getByText('To keep your basket.')).toBeInTheDocument();
  });

  it('renders no description element when there isn’t one', () => {
    render(<FeatureBar title="We use cookies" />);

    expect(screen.getByRole('region')).toHaveTextContent('We use cookies');
  });

  it('is a region labelled by its title', () => {
    render(<FeatureBar title="We use cookies" />);

    expect(screen.getByRole('region', { name: 'We use cookies' })).toBeInTheDocument();
  });

  it('renders an action', () => {
    const onClick = vi.fn();
    render(
      <FeatureBar
        title="We use cookies"
        action={
          <button type="button" onClick={onClick}>
            Accept
          </button>
        }
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Accept' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is visible by default', () => {
    render(<FeatureBar title="We use cookies" />);

    expect(screen.getByRole('region')).toBeVisible();
  });

  it('actually hides when told to', () => {
    // The source's hide classes were unprefixed, so none of them matched a
    // generated utility and `hide` did nothing at all.
    render(<FeatureBar title="We use cookies" hide />);

    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { hidden: true })).not.toBeVisible();
  });

  it('takes its action out of the tab order once hidden', () => {
    render(
      <FeatureBar
        title="We use cookies"
        hide
        action={
          <button type="button" onClick={() => {}}>
            Accept
          </button>
        }
      />,
    );

    // Fading with opacity alone would leave this focusable and announced.
    expect(screen.queryByRole('button', { name: 'Accept' })).not.toBeInTheDocument();
  });

  it('can be dismissed by its own action', () => {
    function Notice() {
      const [hidden, setHidden] = useState(false);
      return (
        <FeatureBar
          title="We use cookies"
          hide={hidden}
          action={
            <button type="button" onClick={() => setHidden(true)}>
              Accept
            </button>
          }
        />
      );
    }

    render(<Notice />);
    expect(screen.getByRole('region')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Accept' }));

    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('spreads DOM props', () => {
    render(<FeatureBar title="We use cookies" id="cookie-bar" className="tall" />);

    const bar = screen.getByRole('region');
    expect(bar).toHaveAttribute('id', 'cookie-bar');
    expect(bar).toHaveClass('tall');
  });
});
