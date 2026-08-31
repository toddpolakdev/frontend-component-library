import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { OptionTile } from './OptionTile';

const meta: Meta<typeof OptionTile> = {
  title: 'Components/OptionTile',
  component: OptionTile,
  args: {
    title: 'Ship to store',
    description: 'Free, ready in 3 days',
    iconVariant: 'LocalShipping',
    selected: false,
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof OptionTile>;

export const Default: Story = {};

export const Selected: Story = {
  args: { selected: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/** Title only, no supporting line. */
export const TitleOnly: Story = {
  args: { description: undefined },
};

/** A row where exactly one tile is chosen. */
export const SingleChoice: Story = {
  render: () => {
    const options = [
      {
        value: 'store',
        title: 'To store',
        description: 'Free, ready in 3 days',
        iconVariant: 'LocalShipping' as const,
      },
      {
        value: 'home',
        title: 'To home',
        description: 'From £3.95, 2 days',
        iconVariant: 'Delivery' as const,
      },
      {
        value: 'locker',
        title: 'To locker',
        description: 'Free, ready tomorrow',
        iconVariant: 'BoxSeam' as const,
      },
    ];
    const [chosen, setChosen] = useState('store');

    return (
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {options.map((option) => (
          <OptionTile
            key={option.value}
            title={option.title}
            description={option.description}
            iconVariant={option.iconVariant}
            selected={chosen === option.value}
            onClick={() => setChosen(option.value)}
          />
        ))}
      </div>
    );
  },
};

/** A longer description grows the tile rather than spilling out of it. */
export const LongDescription: Story = {
  args: {
    title: 'Collect nearby',
    description:
      'Pick up from any of 240 partner locations, most open until 10pm seven days a week.',
  },
};
