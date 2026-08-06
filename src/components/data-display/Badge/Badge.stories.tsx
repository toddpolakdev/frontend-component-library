import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './Badge';

const variants = ['client', 'lead', 'vendor', 'partner', 'admin', 'user'] as const;

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  args: {
    children: 'Client',
    variant: 'client',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: variants,
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {variants.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant.charAt(0).toUpperCase() + variant.slice(1)}
        </Badge>
      ))}
    </div>
  ),
};
