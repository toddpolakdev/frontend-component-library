import type { Meta, StoryObj } from '@storybook/react';

import { Icon } from './Icon';
import { ICON_VARIANTS } from './variants';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  args: {
    variant: 'Check',
    size: 24,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ICON_VARIANTS,
    },
    size: {
      control: { type: 'range', min: 12, max: 96, step: 2 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {};

/** Every glyph in the set. Each takes its colour from the surrounding text. */
export const Gallery: Story = {
  parameters: { controls: { exclude: ['variant'] } },
  render: ({ size }) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(7.5rem, 1fr))',
        gap: '0.5rem',
        color: 'var(--app-text)',
      }}
    >
      {ICON_VARIANTS.map((variant) => (
        <div
          key={variant}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 0.5rem',
            border: '1px solid var(--app-border)',
            borderRadius: 10,
            background: 'var(--app-surface)',
          }}
        >
          <Icon variant={variant} size={size} />
          <code style={{ fontSize: '0.65rem', color: 'var(--app-muted)', textAlign: 'center' }}>
            {variant}
          </code>
        </div>
      ))}
    </div>
  ),
};

/** `size` drives both dimensions; the art keeps its own proportions. */
export const Sizes: Story = {
  render: ({ variant }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--app-text)' }}>
      {[16, 20, 24, 32, 48, 64].map((size) => (
        <Icon key={size} variant={variant} size={size} />
      ))}
    </div>
  ),
};

/** Icons inherit `currentColor`, so they follow the colour of their container. */
export const InheritsColor: Story = {
  render: ({ variant, size }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <span style={{ color: 'var(--app-primary)' }}>
        <Icon variant={variant} size={size} />
      </span>
      <span style={{ color: 'var(--app-danger)' }}>
        <Icon variant={variant} size={size} />
      </span>
      <span style={{ color: 'var(--app-muted)' }}>
        <Icon variant={variant} size={size} />
      </span>
      <button
        type="button"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.9rem',
          borderRadius: 8,
          border: '1px solid var(--app-border-strong)',
          background: 'var(--app-surface)',
          color: 'var(--app-text)',
          font: 'inherit',
          cursor: 'pointer',
        }}
      >
        <Icon variant={variant} size={18} />
        In a button
      </button>
    </div>
  ),
};

/**
 * A bare icon is decorative and stays `aria-hidden`. Pass `label` when the icon
 * is the only thing conveying the meaning — it becomes `role="img"` with a name.
 */
export const Labelled: Story = {
  args: {
    variant: 'Trash',
    label: 'Delete item',
    size: 28,
  },
};
