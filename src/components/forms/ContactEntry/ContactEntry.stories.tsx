import type { Meta, StoryObj } from '@storybook/react';

import { ContactEntry } from './ContactEntry';

const meta: Meta<typeof ContactEntry> = {
  title: 'Components/ContactEntry',
  component: ContactEntry,
  args: {
    submitLabel: 'Save Contact',
    compact: false,
    onSubmit: (values) => console.log('submit', values),
    onCancel: () => console.log('cancel'),
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof ContactEntry>;

export const Default: Story = {};

export const Compact: Story = {
  args: { compact: true },
};

export const Prefilled: Story = {
  args: {
    initialValues: {
      firstName: 'Jordan',
      lastName: 'Smith',
      email: 'jordan@example.com',
      phone: '(614) 555-0142',
      company: 'Brightside Consulting',
      category: 'Client',
      notes: 'Met at the spring conference.',
    },
  },
};
