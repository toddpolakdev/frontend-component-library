import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { PrimaryButton } from '../../inputs';
import { FeatureBar } from './FeatureBar';

const meta: Meta<typeof FeatureBar> = {
  title: 'Components/FeatureBar',
  component: FeatureBar,
  args: {
    title: 'This site uses cookies',
    description: 'We keep your basket and remember your store. Nothing else.',
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof FeatureBar>;

export const Default: Story = {};

export const WithAction: Story = {
  render: (args) => (
    <FeatureBar
      {...args}
      action={
        <PrimaryButton variant="secondary" fullWidthOnMobile={false} onClick={() => {}}>
          Accept
        </PrimaryButton>
      }
    />
  ),
};

/** Dismissing it slides the bar out, then takes it out of the tab order. */
export const Dismissable: Story = {
  render: (args) => {
    const [hidden, setHidden] = useState(false);

    return (
      <div style={{ padding: '2rem', minHeight: '60vh' }}>
        <PrimaryButton
          fullWidthOnMobile={false}
          onClick={() => setHidden((value) => !value)}
        >
          {hidden ? 'Bring it back' : 'Hide the bar'}
        </PrimaryButton>

        <FeatureBar
          {...args}
          hide={hidden}
          action={
            <PrimaryButton
              variant="secondary"
              fullWidthOnMobile={false}
              onClick={() => setHidden(true)}
            >
              Accept
            </PrimaryButton>
          }
        />
      </div>
    );
  },
};

/** Title only, for a short announcement. */
export const TitleOnly: Story = {
  args: {
    title: 'Free delivery on orders over £50',
    description: undefined,
  },
};

/** Starts hidden, so nothing is announced or focusable until it's shown. */
export const Hidden: Story = {
  args: { hide: true },
};
