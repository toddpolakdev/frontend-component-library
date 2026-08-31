import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { PrimaryButton } from '../../inputs';
import { Text } from '../../data-display';
import { Drawer } from './Drawer';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  args: {
    title: 'Your basket',
    side: 'right',
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['left', 'right'] },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

/** Focus moves in on open and returns to the trigger on close. */
export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <PrimaryButton fullWidthOnMobile={false} onClick={() => setOpen(true)}>
          Open drawer
        </PrimaryButton>

        <Drawer {...args} isOpen={open} onClose={() => setOpen(false)}>
          <Text>
            Escape closes it, the scrim closes it, and Tab cycles inside the panel rather than
            walking into the page behind.
          </Text>
        </Drawer>
      </>
    );
  },
};

/** From the left, for navigation menus. */
export const FromTheLeft: Story = {
  args: { side: 'left', title: 'Menu' },
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <PrimaryButton fullWidthOnMobile={false} onClick={() => setOpen(true)}>
          Open menu
        </PrimaryButton>

        <Drawer {...args} isOpen={open} onClose={() => setOpen(false)}>
          <nav>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: '0.75rem' }}>
              {['New in', 'Knitwear', 'Shirting', 'Outerwear', 'Sale'].map((item) => (
                <li key={item}>
                  <a href={`#${item}`} style={{ color: 'var(--app-text)' }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Drawer>
      </>
    );
  },
};

/** Wider, for filter panels. */
export const Wide: Story = {
  args: { title: 'Filters', width: '40rem' },
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <PrimaryButton fullWidthOnMobile={false} onClick={() => setOpen(true)}>
          Open filters
        </PrimaryButton>

        <Drawer {...args} isOpen={open} onClose={() => setOpen(false)}>
          <Text>A wider panel, still capped to the viewport on small screens.</Text>
        </Drawer>
      </>
    );
  },
};

/** No header at all — supply your own chrome inside. */
export const NoHeader: Story = {
  args: { title: undefined, label: 'Basket', showClose: false },
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <PrimaryButton fullWidthOnMobile={false} onClick={() => setOpen(true)}>
          Open bare drawer
        </PrimaryButton>

        <Drawer {...args} isOpen={open} onClose={() => setOpen(false)}>
          <Text variant="sectionHeading" as="h2">
            Your basket
          </Text>
          <PrimaryButton fullWidthOnMobile={false} onClick={() => setOpen(false)}>
            Done
          </PrimaryButton>
        </Drawer>
      </>
    );
  },
};
