import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { PrimaryButton } from './PrimaryButton';

const ArrowIcon = () => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
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
      options: {
        dark: { name: 'dark', value: '#020617' }
      }
    },
  },

  globals: {
    backgrounds: {
      value: "dark"
    }
  }
};

const panelStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  borderRadius: '0.75rem',
  border: '1px solid #e2e8f0',
  padding: '1rem',
};

const labelStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '#475569',
};

export const ResponsiveShowcase: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '64rem' }}>
      <div style={panelStyle}>
        <p style={labelStyle}>Mobile layout</p>
        <div style={{ maxWidth: '20rem' }}>
          <PrimaryButton {...args}>Continue on mobile</PrimaryButton>
        </div>
      </div>
      <div style={panelStyle}>
        <p style={labelStyle}>Tablet layout</p>
        <div style={{ maxWidth: '28rem' }}>
          <PrimaryButton {...args} icon={<ArrowIcon />}>
            Continue on tablet
          </PrimaryButton>
        </div>
      </div>
      <div style={panelStyle}>
        <p style={labelStyle}>Desktop layout</p>
        <div style={{ maxWidth: '42rem' }}>
          <PrimaryButton {...args} fullWidthOnMobile={false} icon={<ArrowIcon />} iconPosition="right">
            Continue on desktop
          </PrimaryButton>
        </div>
      </div>
    </div>
  ),
};
