import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { PrimaryButton } from '../../inputs';
import { VideoModal } from './VideoModal';

const meta: Meta<typeof VideoModal> = {
  title: 'Components/VideoModal',
  component: VideoModal,
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof VideoModal>;

export const Open: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=IJ-FAcYq_08',
  },
};

/** Opened from a trigger, the way a host app would use it. */
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
        {open ? <VideoModal {...args} onClose={() => setOpen(false)} /> : null}
      </div>
    );
  },
};

/** A playlist enables previous/next, shuffle, and auto-advance on end. */
export const Playlist: Story = {
  args: {
    url: undefined,
    tracks: [
      {
        id: '1',
        title: 'First video',
        url: 'https://www.youtube.com/watch?v=IJ-FAcYq_08',
      },
      {
        id: '2',
        title: 'Second video',
        url: 'https://www.youtube.com/watch?v=vA5TTz6BXhY',
      },
      {
        id: '3',
        title: 'Third video',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    ],
  },
};

/** Without the remote: a close button, click-to-toggle, and keyboard control. */
export const WithoutRemote: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=IJ-FAcYq_08',
    showRemote: false,
  },
};

/** An unreadable link is reported on the screen rather than rendering black. */
export const UnrecognizedUrl: Story = {
  args: {
    url: 'https://example.com/not-a-youtube-link',
  },
};
