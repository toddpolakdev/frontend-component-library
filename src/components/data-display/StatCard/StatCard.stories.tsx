import type { Meta, StoryObj } from '@storybook/react';

import { StatCard } from './StatCard';

const variants = ['blue', 'purple', 'pink', 'green'] as const;

const meta: Meta<typeof StatCard> = {
  title: 'Components/StatCard',
  component: StatCard,
  args: {
    title: 'Total Contacts',
    value: '1,248',
    description: 'Up 12% from last month',
    icon: '👥',
    variant: 'blue',
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
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', maxWidth: '52rem' }}>
      <StatCard title="Total Contacts" value="1,248" description="Up 12% this month" icon="👥" variant="blue" />
      <StatCard title="Open Leads" value="86" description="18 added this week" icon="🎯" variant="purple" />
      <StatCard title="Revenue" value="$94k" description="Quarterly to date" icon="💰" variant="pink" />
      <StatCard title="Closed Deals" value="37" description="On track for target" icon="✅" variant="green" />
    </div>
  ),
};
