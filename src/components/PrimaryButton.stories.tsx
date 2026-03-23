import type { Meta, StoryObj } from '@storybook/react';

import { PrimaryButton } from './PrimaryButton';

const meta: Meta<typeof PrimaryButton> = {
  title: 'Components/PrimaryButton',
  component: PrimaryButton,
  args: {
    children: 'Continue',
    ariaLabel: 'Continue to next step',
    fullWidthOnMobile: true,
    themeMode: 'system',
  },
  argTypes: {
    iconPosition: {
      control: 'inline-radio',
      options: ['left', 'right'],
    },
    themeMode: {
      control: 'inline-radio',
      options: ['system', 'light', 'dark'],
    },
  },
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PrimaryButton>;

const ArrowIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    children: 'Get started',
    ariaLabel: 'Get started now',
    icon: <ArrowIcon />,
  },
};

export const Loading: Story = {
  args: {
    children: 'Saving',
    ariaLabel: 'Saving your progress',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Unavailable',
    ariaLabel: 'Action unavailable',
    disabled: true,
  },
};

export const DarkMode: Story = {
  args: {
    children: 'Dark mode CTA',
    ariaLabel: 'Dark mode call to action',
    icon: <ArrowIcon />,
    themeMode: 'dark',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#020617' }],
    },
  },
};
