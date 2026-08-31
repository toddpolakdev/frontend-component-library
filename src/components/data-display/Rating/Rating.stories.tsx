import type { Meta, StoryObj } from '@storybook/react';

import { Rating } from './Rating';

const meta: Meta<typeof Rating> = {
  title: 'Components/Rating',
  component: Rating,
  args: {
    value: 4,
    max: 5,
    size: 20,
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 5, step: 0.1 } },
    size: { control: { type: 'range', min: 12, max: 48, step: 2 } },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {};

/** Filled stars inherit `color`, so the palette is the caller's choice. */
export const Colored: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <div style={{ color: 'goldenrod' }}>
        <Rating {...args} />
      </div>
      <div style={{ color: 'var(--app-primary)' }}>
        <Rating {...args} />
      </div>
      <div style={{ color: 'var(--app-text)' }}>
        <Rating {...args} />
      </div>
    </div>
  ),
};

/** Fractions round down — 4.9 fills four stars, but announces "4.9 out of 5". */
export const EveryScore: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '0.5rem', color: 'goldenrod' }}>
      {[0, 1, 2.5, 3, 4.9, 5].map((value) => (
        <div key={value} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Rating {...args} value={value} />
          <code style={{ fontSize: '0.75rem', color: 'var(--app-muted)' }}>value={value}</code>
        </div>
      ))}
    </div>
  ),
};

/** Any scale works, not just five. */
export const OutOfTen: Story = {
  args: {
    value: 7,
    max: 10,
    size: 16,
  },
  render: (args) => (
    <div style={{ color: 'goldenrod' }}>
      <Rating {...args} />
    </div>
  ),
};

/** A fuller label for cases where the score alone isn't the whole story. */
export const WithReviewCount: Story = {
  args: {
    value: 4,
    label: '4 out of 5 stars, from 312 reviews',
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'goldenrod' }}>
      <Rating {...args} />
      <span style={{ fontSize: '0.875rem', color: 'var(--app-muted)' }}>(312)</span>
    </div>
  ),
};
