import type { Meta, StoryObj } from '@storybook/react';

import { Clock } from './Clock';

const meta: Meta<typeof Clock> = {
  title: 'Components/Clock',
  component: Clock,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Clock>;

export const Default: Story = {};
