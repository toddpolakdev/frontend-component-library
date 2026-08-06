import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { FloatingWindow } from './FloatingWindow';

const meta: Meta<typeof FloatingWindow> = {
  title: 'Components/FloatingWindow',
  component: FloatingWindow,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof FloatingWindow>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    if (!open) {
      return <p style={{ padding: '2rem' }}>Window closed.</p>;
    }

    return (
      <div style={{ height: '100vh', position: 'relative' }}>
        <FloatingWindow
          title="Notes"
          onClose={() => setOpen(false)}
          onMinimize={() => undefined}
          initialPosition={{ x: 80, y: 80 }}
        >
          <p>Drag me by the header. Use the controls to minimize or close.</p>
        </FloatingWindow>
      </div>
    );
  },
};
