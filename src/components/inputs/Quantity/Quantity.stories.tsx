import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Quantity } from './Quantity';

const meta: Meta<typeof Quantity> = {
  title: 'Components/Quantity',
  component: Quantity,
  args: {
    value: 1,
    min: 0,
  },
};

export default meta;
type Story = StoryObj<typeof Quantity>;

/** Controlled: the caller owns the value. */
export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <Quantity {...args} value={value} onChange={setValue} />;
  },
};

/** With a ceiling. Pressing + at the cap explains why it won't go higher. */
export const WithMax: Story = {
  args: {
    value: 2,
    max: 3,
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <Quantity
        {...args}
        value={value}
        onChange={setValue}
        maxMessage={`Only ${args.max} available`}
      />
    );
  },
};

/** A cap of zero still explains itself, rather than silently doing nothing. */
export const Unavailable: Story = {
  args: {
    value: 0,
    max: 0,
  },
  render: (args) => (
    <Quantity {...args} onChange={() => {}} maxMessage="Out of stock" />
  ),
};

/** Minimum of one, for a line item that can't drop to zero. */
export const MinimumOfOne: Story = {
  args: {
    value: 1,
    min: 1,
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <Quantity {...args} value={value} onChange={setValue} />;
  },
};

/** While a mutation is in flight, the host app can lock the whole control. */
export const Disabled: Story = {
  args: {
    value: 3,
    disabled: true,
  },
  render: (args) => <Quantity {...args} onChange={() => {}} />,
};

/**
 * Several on one page — each field gets its own generated id, so labels and
 * descriptions stay wired to the right control.
 */
export const CartLines: Story = {
  render: () => {
    const [lines, setLines] = useState([
      { id: 'a', name: 'Merino crew neck', quantity: 1, available: 4 },
      { id: 'b', name: 'Oxford shirt', quantity: 2, available: 2 },
      { id: 'c', name: 'Chino trousers', quantity: 1, available: 9 },
    ]);

    return (
      <div style={{ display: 'grid', gap: '1rem', minWidth: '22rem' }}>
        {lines.map((line) => (
          <div
            key={line.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <span style={{ color: 'var(--app-text)' }}>{line.name}</span>
            <Quantity
              value={line.quantity}
              min={1}
              max={line.available}
              label={`Quantity for ${line.name}`}
              maxMessage={`Only ${line.available} available`}
              onChange={(quantity) =>
                setLines((current) =>
                  current.map((item) => (item.id === line.id ? { ...item, quantity } : item)),
                )
              }
            />
          </div>
        ))}
      </div>
    );
  },
};
