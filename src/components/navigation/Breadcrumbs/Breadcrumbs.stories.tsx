import type { Meta, StoryObj } from '@storybook/react';

import { Breadcrumbs } from './Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Backpacks', href: '/collections/backpacks' },
      { label: 'Campus Backpack' },
    ],
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

/** The last step is the current page: not a link, and marked `aria-current`. */
export const Default: Story = {};

export const TwoLevels: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Backpacks' },
    ],
  },
};

/** One step, and no dangling separator. */
export const SingleStep: Story = {
  args: { items: [{ label: 'Home' }] },
};

export const CustomSeparator: Story = {
  args: { separator: '›' },
};

/** A deep trail wraps rather than overflowing. */
export const Deep: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Bags', href: '/bags' },
      { label: 'Backpacks', href: '/bags/backpacks' },
      { label: 'Laptop backpacks', href: '/bags/backpacks/laptop' },
      { label: 'Campus Backpack in Cotton Twill' },
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: '26rem' }}>
      <Breadcrumbs {...args} />
    </div>
  ),
};
