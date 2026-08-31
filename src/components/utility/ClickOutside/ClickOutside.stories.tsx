import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { PrimaryButton } from '../../inputs';
import { ClickOutside } from './ClickOutside';

const meta: Meta<typeof ClickOutside> = {
  title: 'Components/ClickOutside',
  component: ClickOutside,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof ClickOutside>;

const panelStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 0.5rem)',
  left: 0,
  zIndex: 10,
  minWidth: '12rem',
  padding: '0.5rem',
  border: '1px solid var(--app-border)',
  borderRadius: 10,
  background: 'var(--app-surface)',
  boxShadow: 'var(--app-shadow)',
  listStyle: 'none',
  margin: 0,
};

/** The usual job: dismiss a menu when the pointer goes down elsewhere. */
export const DismissAMenu: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{ position: 'relative', width: 'fit-content' }}>
          <ClickOutside active={open} onClickOutside={() => setOpen(false)}>
            <PrimaryButton fullWidthOnMobile={false} onClick={() => setOpen((v) => !v)}>
              {open ? 'Hide menu' : 'Show menu'}
            </PrimaryButton>
            {open ? (
              <ul style={panelStyle}>
                <li style={{ padding: '0.4rem 0.6rem' }}>Account</li>
                <li style={{ padding: '0.4rem 0.6rem' }}>Orders</li>
                <li style={{ padding: '0.4rem 0.6rem' }}>Sign out</li>
              </ul>
            ) : null}
          </ClickOutside>
        </div>

        <p style={{ color: 'var(--app-muted)', fontSize: '0.875rem' }}>
          Click anywhere out here to close it. Clicking a menu item leaves it open — the trigger
          and the panel are both inside, so neither counts as outside.
        </p>
      </div>
    );
  },
};

/**
 * `active` gates the listener, so nothing is bound while the thing it guards is
 * closed. Toggle it to watch the behaviour switch off.
 */
export const Gated: Story = {
  render: () => {
    const [listening, setListening] = useState(true);
    const [outsideClicks, setOutsideClicks] = useState(0);

    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <ClickOutside active={listening} onClickOutside={() => setOutsideClicks((n) => n + 1)}>
          <div
            style={{
              padding: '1.5rem',
              border: '1px dashed var(--app-border-strong)',
              borderRadius: 10,
              width: 'fit-content',
              color: 'var(--app-text)',
            }}
          >
            Inside — clicks here never count
          </div>
        </ClickOutside>

        <label style={{ display: 'flex', gap: '0.5rem', color: 'var(--app-text)' }}>
          <input
            type="checkbox"
            checked={listening}
            onChange={(event) => setListening(event.target.checked)}
          />
          Listening
        </label>

        <p style={{ color: 'var(--app-muted)', fontSize: '0.875rem' }}>
          Outside clicks counted: <strong>{outsideClicks}</strong>
        </p>
      </div>
    );
  },
};
