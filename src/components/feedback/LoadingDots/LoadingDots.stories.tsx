import type { Meta, StoryObj } from '@storybook/react';

import { PrimaryButton } from '../../inputs';
import { LoadingDots } from './LoadingDots';

const meta: Meta<typeof LoadingDots> = {
  title: 'Components/LoadingDots',
  component: LoadingDots,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof LoadingDots>;

export const Default: Story = {};

/** Colour and scale come from the surrounding text via `currentColor`. */
export const InheritsColorAndSize: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <span style={{ color: 'var(--app-text)' }}>
        <LoadingDots />
      </span>
      <span style={{ color: 'var(--app-primary)' }}>
        <LoadingDots />
      </span>
      <span style={{ color: 'var(--app-danger)' }}>
        <LoadingDots />
      </span>
    </div>
  ),
};

/** Inline in a line of copy. */
export const Inline: Story = {
  render: () => (
    <p style={{ color: 'var(--app-text)' }}>
      Checking stock in nearby stores <LoadingDots label="" />
    </p>
  ),
};

/**
 * Inside a button. The label is blanked because the button already announces its
 * own loading state, so the two don't talk over each other.
 */
export const InAButton: Story = {
  render: () => (
    <PrimaryButton fullWidthOnMobile={false} onClick={() => {}}>
      Adding to bag <LoadingDots label="" />
    </PrimaryButton>
  ),
};
