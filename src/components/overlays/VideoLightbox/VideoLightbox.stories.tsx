import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { PrimaryButton } from '../../inputs';
import { VideoLightbox } from './VideoLightbox';

const meta: Meta<typeof VideoLightbox> = {
  title: 'Components/VideoLightbox',
  component: VideoLightbox,
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof VideoLightbox>;

export const Open: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=IJ-FAcYq_08',
  },
};

export const Interactive: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=vA5TTz6BXhY',
  },

  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <div style={{ padding: '2rem' }}>
        <PrimaryButton fullWidthOnMobile={false} onClick={() => setOpen(true)}>
          Play video
        </PrimaryButton>
        {open ? <VideoLightbox {...args} onClose={() => setOpen(false)} /> : null}
      </div>
    );
  },
};
