import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { PrimaryButton } from '../../inputs';
import { LoadingDots } from '../LoadingDots';
import { LoadingOverlay } from './LoadingOverlay';

const meta: Meta<typeof LoadingOverlay> = {
  title: 'Components/LoadingOverlay',
  component: LoadingOverlay,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof LoadingOverlay>;

export const Default: Story = {};

/** Contained to a panel, for a busy state on one card rather than the page. */
export const OverAPanel: Story = {
  args: { contained: true, label: 'Updating your basket' },
  render: (args) => (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          position: 'relative',
          maxWidth: '26rem',
          padding: '1.5rem',
          border: '1px solid var(--app-border)',
          borderRadius: 12,
          background: 'var(--app-surface)',
          color: 'var(--app-text)',
        }}
      >
        <h3 style={{ margin: '0 0 0.5rem' }}>Your basket</h3>
        <p style={{ margin: 0, color: 'var(--app-muted)' }}>
          The veil tints the app background, so it follows the theme instead of
          flashing white.
        </p>
        <LoadingOverlay {...args} />
      </div>
    </div>
  ),
};

/** Any content can stand in for the spinner. */
export const CustomContent: Story = {
  args: { contained: true },
  render: (args) => (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          position: 'relative',
          minHeight: '10rem',
          maxWidth: '26rem',
          border: '1px dashed var(--app-border-strong)',
          borderRadius: 12,
        }}
      >
        <LoadingOverlay {...args} label="Checking stock">
          <span style={{ color: 'var(--app-text)' }}>
            Checking stock <LoadingDots label="" />
          </span>
        </LoadingOverlay>
      </div>
    </div>
  ),
};

/** Toggled around a pretend request. */
export const WhileSaving: Story = {
  render: () => {
    const [busy, setBusy] = useState(false);

    const save = () => {
      setBusy(true);
      window.setTimeout(() => setBusy(false), 1800);
    };

    return (
      <div style={{ padding: '2rem' }}>
        <PrimaryButton fullWidthOnMobile={false} onClick={save}>
          Save changes
        </PrimaryButton>
        {busy ? <LoadingOverlay label="Saving changes" /> : null}
      </div>
    );
  },
};
