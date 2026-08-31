import type { Meta, StoryObj } from '@storybook/react';

import { Container } from './Container';

const meta: Meta<typeof Container> = {
  title: 'Components/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

const Block = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: '2rem',
      background: 'var(--app-surface)',
      border: '1px dashed var(--app-border-strong)',
      color: 'var(--app-text)',
    }}
  >
    {children}
  </div>
);

/** Centred within the default 1920px cap, with 1.5rem gutters. */
export const Default: Story = {
  render: (args) => (
    <div style={{ background: 'var(--app-surface-muted)', paddingBlock: '2rem' }}>
      <Container {...args}>
        <Block>Centred content with gutters</Block>
      </Container>
    </div>
  ),
};

/** A narrower cap, which is what most reading content actually wants. */
export const NarrowContent: Story = {
  args: { maxWidth: '48rem' },
  render: (args) => (
    <div style={{ background: 'var(--app-surface-muted)', paddingBlock: '2rem' }}>
      <Container {...args}>
        <Block>Capped at 48rem</Block>
      </Container>
    </div>
  ),
};

/** Edge to edge — for full-bleed sections like a hero. */
export const FullWidth: Story = {
  args: { fullWidth: true },
  render: (args) => (
    <div style={{ background: 'var(--app-surface-muted)', paddingBlock: '2rem' }}>
      <Container {...args}>
        <Block>No max width, no gutters</Block>
      </Container>
    </div>
  ),
};

/** `as` picks the element, so it can be a real landmark. */
export const AsMain: Story = {
  args: { as: 'main', maxWidth: '60rem' },
  render: (args) => (
    <div style={{ background: 'var(--app-surface-muted)', paddingBlock: '2rem' }}>
      <Container {...args}>
        <Block>Rendered as &lt;main&gt;</Block>
      </Container>
    </div>
  ),
};
