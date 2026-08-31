import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Switch } from './Switch';

const metric = { label: 'Metric', value: 'metric' };
const imperial = { label: 'Imperial', value: 'imperial' };

function renderSwitch(props: Partial<Parameters<typeof Switch<string>>[0]> = {}) {
  const onChange = vi.fn();
  const result = render(
    <Switch
      label="Units"
      firstOption={metric}
      secondOption={imperial}
      value="metric"
      onChange={onChange}
      {...props}
    />,
  );
  return { onChange, ...result };
}

describe('Switch', () => {
  it('renders both option labels', () => {
    renderSwitch();

    expect(screen.getByText('Metric')).toBeInTheDocument();
    expect(screen.getByText('Imperial')).toBeInTheDocument();
  });

  it('exposes a named radio group', () => {
    // The source announced nothing: a hidden checkbox and two bare <label>s.
    renderSwitch();

    expect(screen.getByRole('radiogroup', { name: 'Units' })).toBeInTheDocument();
  });

  it('marks the matching option as checked', () => {
    renderSwitch({ value: 'imperial' });

    expect(screen.getByRole('radio', { name: 'Metric' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Imperial' })).toBeChecked();
  });

  it('reports the value when an option is chosen', () => {
    const { onChange } = renderSwitch({ value: 'metric' });

    fireEvent.click(screen.getByRole('radio', { name: 'Imperial' }));

    expect(onChange).toHaveBeenCalledWith('imperial');
  });

  it('selects an option when its visible label is clicked', () => {
    const { onChange } = renderSwitch({ value: 'metric' });

    fireEvent.click(screen.getByText('Imperial'));

    expect(onChange).toHaveBeenCalledWith('imperial');
  });

  it('is keyboard reachable', () => {
    // The source hid its input with `visibility: hidden`, removing it from the
    // tab order, and stubbed onChange — so it was mouse-only.
    renderSwitch();

    const first = screen.getByRole('radio', { name: 'Metric' });
    first.focus();
    expect(first).toHaveFocus();
  });

  it('toggles to the other value when the track is clicked', () => {
    const { onChange, container } = renderSwitch({ value: 'metric' });

    // The track is aria-hidden, so it is reached through the DOM rather than a role.
    fireEvent.click(container.querySelector('label[aria-hidden="true"]')!);

    expect(onChange).toHaveBeenCalledWith('imperial');
  });

  it('toggles back from the second value', () => {
    const { onChange, container } = renderSwitch({ value: 'imperial' });

    fireEvent.click(container.querySelector('label[aria-hidden="true"]')!);

    expect(onChange).toHaveBeenCalledWith('metric');
  });

  it('keeps the track out of the options’ accessible names', () => {
    // A second <label for> with no aria-hidden would concatenate into the name.
    renderSwitch();

    expect(screen.getByRole('radio', { name: 'Metric' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Imperial' })).toBeInTheDocument();
  });

  it('marks the knob position for assertion', () => {
    // jsdom cannot see the styled transform, so the state is a data attribute.
    const { container, rerender } = renderSwitch({ value: 'metric' });
    const track = container.querySelector('label[aria-hidden="true"]')!;
    expect(track).not.toHaveAttribute('data-checked');

    rerender(
      <Switch
        label="Units"
        firstOption={metric}
        secondOption={imperial}
        value="imperial"
        onChange={() => {}}
      />,
    );
    expect(container.querySelector('label[aria-hidden="true"]')).toHaveAttribute('data-checked');
  });

  it('leaves both unselected when the value matches neither option', () => {
    renderSwitch({ value: 'nautical' });

    expect(screen.getByRole('radio', { name: 'Metric' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Imperial' })).not.toBeChecked();
  });

  it('disables both options', () => {
    // Asserted as the attribute rather than a suppressed click: jsdom's
    // fireEvent dispatches to disabled inputs anyway, so a click-based check
    // would fail here while passing in every real browser.
    const { container } = renderSwitch({ disabled: true });

    expect(screen.getByRole('radio', { name: 'Metric' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: 'Imperial' })).toBeDisabled();
    expect(container.querySelector('[data-disabled]')).toBeInTheDocument();
  });

  it('gives each instance its own ids and group name', () => {
    // The source hardcoded id="react-switch-new", so a second Switch collided
    // with the first and its label toggled the wrong control.
    const { container } = render(
      <div>
        <Switch
          label="Units"
          firstOption={metric}
          secondOption={imperial}
          value="metric"
          onChange={() => {}}
        />
        <Switch
          label="Appearance"
          firstOption={{ label: 'Light', value: 'light' }}
          secondOption={{ label: 'Dark', value: 'dark' }}
          value="light"
          onChange={() => {}}
        />
      </div>,
    );

    const ids = [...container.querySelectorAll('input')].map((input) => input.id);
    expect(new Set(ids).size).toBe(ids.length);

    const names = [...container.querySelectorAll('input')].map((input) => input.name);
    expect(new Set(names).size).toBe(2);
  });

  it('does not drive a sibling switch', () => {
    function Pair() {
      const [units, setUnits] = useState('metric');
      const [theme, setTheme] = useState('light');
      return (
        <div>
          <Switch
            label="Units"
            firstOption={metric}
            secondOption={imperial}
            value={units}
            onChange={setUnits}
          />
          <Switch
            label="Appearance"
            firstOption={{ label: 'Light', value: 'light' }}
            secondOption={{ label: 'Dark', value: 'dark' }}
            value={theme}
            onChange={setTheme}
          />
        </div>
      );
    }

    render(<Pair />);

    fireEvent.click(screen.getByText('Dark'));

    expect(screen.getByRole('radio', { name: 'Dark' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Metric' })).toBeChecked();
  });

  it('works with non-string values', () => {
    const onChange = vi.fn();
    render(
      <Switch
        label="Billing period"
        firstOption={{ label: 'Monthly', value: false }}
        secondOption={{ label: 'Annual', value: true }}
        value={false}
        onChange={onChange}
      />,
    );

    expect(screen.getByRole('radio', { name: 'Monthly' })).toBeChecked();

    fireEvent.click(screen.getByText('Annual'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('takes a className on the wrapper', () => {
    renderSwitch({ className: 'inline' });

    expect(screen.getByRole('radiogroup', { name: 'Units' })).toHaveClass('inline');
  });
});
