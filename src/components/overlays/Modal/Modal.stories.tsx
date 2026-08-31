import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { PrimaryButton } from '../../inputs';
import { Text } from '../../data-display';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  args: {
    label: 'Example dialog',
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

/** Open it from a trigger — focus moves in, and returns to the trigger on close. */
export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <PrimaryButton fullWidthOnMobile={false} onClick={() => setOpen(true)}>
          Open modal
        </PrimaryButton>

        <Modal {...args} isOpen={open} onClose={() => setOpen(false)} labelledBy="modal-title">
          <Text variant="pageHeading" as="h2" id="modal-title">
            Order summary
          </Text>
          <Text>
            Escape closes it, clicking the scrim closes it, and Tab cycles within the dialog
            instead of walking into the page behind.
          </Text>
        </Modal>
      </>
    );
  },
};

/** Long content scrolls inside the dialog, capped at 60vh. */
export const Scrolling: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <PrimaryButton fullWidthOnMobile={false} onClick={() => setOpen(true)}>
          Open long modal
        </PrimaryButton>

        <Modal {...args} isOpen={open} onClose={() => setOpen(false)} labelledBy="terms-title">
          <Text variant="pageHeading" as="h2" id="terms-title">
            Terms
          </Text>
          {Array.from({ length: 14 }, (_, i) => (
            <Text key={i}>
              Section {i + 1}. The scrollbar is left visible on purpose, so it's obvious there
              is more to read.
            </Text>
          ))}
        </Modal>
      </>
    );
  },
};

/** With a form inside, to show the focus trap over several controls. */
export const WithForm: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <PrimaryButton fullWidthOnMobile={false} onClick={() => setOpen(true)}>
          Open form
        </PrimaryButton>

        <Modal {...args} isOpen={open} onClose={() => setOpen(false)} labelledBy="form-title">
          <Text variant="pageHeading" as="h2" id="form-title">
            Add a note
          </Text>
          <div style={{ display: 'grid', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <label htmlFor="note-subject">Subject</label>
            <input id="note-subject" style={{ padding: '0.5rem' }} />
            <label htmlFor="note-body">Note</label>
            <textarea id="note-body" rows={4} style={{ padding: '0.5rem' }} />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <PrimaryButton
                variant="secondary"
                fullWidthOnMobile={false}
                onClick={() => setOpen(false)}
              >
                Cancel
              </PrimaryButton>
              <PrimaryButton fullWidthOnMobile={false} onClick={() => setOpen(false)}>
                Save
              </PrimaryButton>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};

/** Dismissal locked down, so the only way out is a control you provide. */
export const MustDecide: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <PrimaryButton fullWidthOnMobile={false} onClick={() => setOpen(true)}>
          Open blocking modal
        </PrimaryButton>

        <Modal
          {...args}
          isOpen={open}
          onClose={() => setOpen(false)}
          showClose={false}
          dismissOnBackdrop={false}
          dismissOnEscape={false}
          labelledBy="blocking-title"
        >
          <Text variant="pageHeading" as="h2" id="blocking-title">
            Session expiring
          </Text>
          <Text>No scrim click, no Escape, no close button — you have to choose.</Text>
          <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem' }}>
            <PrimaryButton fullWidthOnMobile={false} onClick={() => setOpen(false)}>
              Stay signed in
            </PrimaryButton>
          </div>
        </Modal>
      </>
    );
  },
};
