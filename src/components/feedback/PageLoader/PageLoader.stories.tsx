import type { Meta, StoryObj } from '@storybook/react';

import { PageLoader } from './PageLoader';

const meta: Meta<typeof PageLoader> = {
  title: 'Components/PageLoader',
  component: PageLoader,
  args: {
    mark: 'CRM',
    label: 'Loading workspace',
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof PageLoader>;

export const Default: Story = {
  args: {
    mark: "Loading",
    label: "Please Wait"
  }
};

export const CustomBrand: Story = {
  args: {
    mark: 'ACME',
    label: 'Preparing your dashboard',
  },
};
