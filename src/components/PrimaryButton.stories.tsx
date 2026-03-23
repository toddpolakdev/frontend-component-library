import type { Meta, StoryObj } from '@storybook/react';

import { PrimaryButton } from './PrimaryButton';

const ArrowIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

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
    loadingLabel: 'Saving your progress',
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

export const ResponsiveShowcase: Story = {
  render: (args) => (
    <div className="flex w-full max-w-5xl flex-col gap-4">
      <div className="space-y-2 rounded-xl border border-slate-200 p-4">
        <p className="text-sm font-medium text-slate-600">Mobile layout</p>
        <div className="max-w-xs">
          <PrimaryButton {...args}>Continue on mobile</PrimaryButton>
        </div>
      </div>
      <div className="space-y-2 rounded-xl border border-slate-200 p-4">
        <p className="text-sm font-medium text-slate-600">Tablet layout</p>
        <div className="max-w-md">
          <PrimaryButton {...args} icon={<ArrowIcon />}>
            Continue on tablet
          </PrimaryButton>
        </div>
      </div>
      <div className="space-y-2 rounded-xl border border-slate-200 p-4">
        <p className="text-sm font-medium text-slate-600">Desktop layout</p>
        <div className="max-w-2xl">
          <PrimaryButton {...args} fullWidthOnMobile={false} icon={<ArrowIcon />} iconPosition="right">
            Continue on desktop
          </PrimaryButton>
        </div>
      </div>
    </div>
  ),
};
