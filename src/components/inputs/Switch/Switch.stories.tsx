import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Switch } from './Switch';

const meta: Meta<typeof Switch<string>> = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Switch<string>>;

/** Controlled: the story owns the value, the switch just reports changes. */
export const Default: Story = {
  render: () => {
    const [units, setUnits] = useState('metric');

    return (
      <Switch
        label="Units"
        firstOption={{ label: 'Metric', value: 'metric' }}
        secondOption={{ label: 'Imperial', value: 'imperial' }}
        value={units}
        onChange={setUnits}
      />
    );
  },
};

/** Starting on the right-hand option. */
export const SecondSelected: Story = {
  render: () => {
    const [units, setUnits] = useState('imperial');

    return (
      <Switch
        label="Units"
        firstOption={{ label: 'Metric', value: 'metric' }}
        secondOption={{ label: 'Imperial', value: 'imperial' }}
        value={units}
        onChange={setUnits}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Switch
      label="Units"
      firstOption={{ label: 'Metric', value: 'metric' }}
      secondOption={{ label: 'Imperial', value: 'imperial' }}
      value="metric"
      onChange={() => {}}
      disabled
    />
  ),
};

/** Values are not limited to strings — here the two options carry booleans. */
export const BooleanValues: Story = {
  render: () => {
    const [annual, setAnnual] = useState(false);

    return (
      <div style={{ display: 'grid', gap: '0.75rem', justifyItems: 'start' }}>
        <Switch
          label="Billing period"
          firstOption={{ label: 'Monthly', value: false }}
          secondOption={{ label: 'Annual', value: true }}
          value={annual}
          onChange={setAnnual}
        />
        <span style={{ color: 'var(--app-muted)', fontSize: '0.8125rem' }}>
          Billing {annual ? 'annually' : 'monthly'}
        </span>
      </div>
    );
  },
};

/**
 * Each instance generates its own ids and radio group name. The source hardcoded
 * `id="react-switch-new"`, so a second switch on the page drove the first one.
 */
export const TwoOnOnePage: Story = {
  render: () => {
    const [units, setUnits] = useState('metric');
    const [theme, setTheme] = useState('light');

    return (
      <div style={{ display: 'grid', gap: '1rem', justifyItems: 'start' }}>
        <Switch
          label="Units"
          firstOption={{ label: 'Metric', value: 'metric' }}
          secondOption={{ label: 'Imperial', value: 'imperial' }}
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
  },
};

/** A value matching neither option: nothing is selected and the knob parks left. */
export const NothingSelected: Story = {
  render: () => (
    <Switch
      label="Units"
      firstOption={{ label: 'Metric', value: 'metric' }}
      secondOption={{ label: 'Imperial', value: 'imperial' }}
      value=""
      onChange={() => {}}
    />
  ),
};
