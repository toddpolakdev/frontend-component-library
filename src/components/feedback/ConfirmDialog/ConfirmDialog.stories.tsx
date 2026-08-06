import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { PrimaryButton } from '../../inputs';
import { ConfirmDialog } from './ConfirmDialog';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  args: {
    isOpen: true,
    title: 'Delete contact?',
    message: 'This will permanently remove the contact and cannot be undone.',
    confirmLabel: 'Delete',
    cancelLabel: 'Keep',
    variant: 'danger',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'danger'],
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Danger: Story = {};

export const Default: Story = {
  args: {
    title: 'Save changes?',
    message: 'Your edits will be applied to this record.',
    confirmLabel: 'Save',
    cancelLabel: 'Cancel',
    variant: 'default',
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ padding: '2rem' }}>
        <PrimaryButton fullWidthOnMobile={false} onClick={() => setIsOpen(true)}>
          Open dialog
        </PrimaryButton>

        <ConfirmDialog
          {...args}
          isOpen={isOpen}
          onCancel={() => setIsOpen(false)}
          onConfirm={() => setIsOpen(false)}
        />
      </div>
    );
  },
};
