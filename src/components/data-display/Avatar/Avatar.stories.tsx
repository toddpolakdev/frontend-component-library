import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  args: {
    name: 'Ada Lovelace',
    color: '#2454c6',
  },
  argTypes: {
    color: { control: 'color' },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};

export const SingleName: Story = {
  args: { name: 'Cher' },
};

export const CustomColor: Story = {
  args: { name: 'Grace Hopper', color: '#0f766e' },
};

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      <Avatar name="Ada Lovelace" color="#2454c6" />
      <Avatar name="Grace Hopper" color="#0f766e" />
      <Avatar name="Alan Turing" color="#b91c1c" />
      <Avatar name="Cher" color="#7c3aed" />
    </div>
  ),
};
