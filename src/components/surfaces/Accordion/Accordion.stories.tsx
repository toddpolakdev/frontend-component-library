import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  args: {
    title: 'Shipping & returns',
    children: 'Ships within two business days. Free returns for 30 days.',
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <Accordion {...args} />
    </div>
  ),
};

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <Accordion {...args} />
    </div>
  ),
};

/** Chevrons instead of the default plus/minus. Any Icon variant works. */
export const ChevronIcons: Story = {
  args: {
    iconClosed: 'ChevronDown',
    iconOpened: 'ChevronUp',
  },
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <Accordion {...args} />
    </div>
  ),
};

/**
 * The chevron-disclosure look: one glyph that turns 90°, sitting ahead of the
 * title. This is what the source's separate `Collapse` component rendered — it's
 * two props here rather than a second component to keep accessible.
 */
export const RotatingChevron: Story = {
  args: {
    rotateIcon: true,
    iconPosition: 'start',
  },
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <Accordion {...args} title="What is your returns policy?">
        Unworn items can be returned within 30 days for a full refund.
      </Accordion>
      <Accordion {...args} title="Do you ship internationally?">
        We ship to 42 countries. Duties are calculated at checkout.
      </Accordion>
    </div>
  ),
};

/** Stacked sections, each managing its own state. */
export const Stacked: Story = {
  render: () => (
    <div style={{ maxWidth: '32rem' }}>
      <Accordion title="Description">
        A midweight merino crew neck, knitted in Italy and finished in Portugal.
      </Accordion>
      <Accordion title="Shipping &amp; returns">
        Ships within two business days. Free returns for 30 days.
      </Accordion>
      <Accordion title="Care">
        <ul>
          <li>Hand wash cold</li>
          <li>Dry flat, away from direct sun</li>
          <li>Do not tumble dry</li>
        </ul>
      </Accordion>
    </div>
  ),
};

/**
 * Controlled, so only one section can be open at a time — the reason `open` and
 * `onOpenChange` exist alongside the uncontrolled `defaultOpen`.
 */
export const OneAtATime: Story = {
  render: () => {
    const sections = [
      { id: 'description', title: 'Description', body: 'A midweight merino crew neck.' },
      { id: 'shipping', title: 'Shipping & returns', body: 'Ships within two business days.' },
      { id: 'care', title: 'Care', body: 'Hand wash cold and dry flat.' },
    ];
    const [openId, setOpenId] = useState<string | null>('description');

    return (
      <div style={{ maxWidth: '32rem' }}>
        {sections.map((section) => (
          <Accordion
            key={section.id}
            title={section.title}
            open={openId === section.id}
            onOpenChange={(open) => setOpenId(open ? section.id : null)}
          >
            {section.body}
          </Accordion>
        ))}
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <Accordion {...args} />
    </div>
  ),
};
