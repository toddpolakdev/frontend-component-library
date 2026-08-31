import type { Meta, StoryObj } from '@storybook/react';

import { RichText } from './RichText';

const meta: Meta<typeof RichText> = {
  title: 'Components/RichText',
  component: RichText,
  args: {
    body: [
      '## Product details',
      '',
      'A midweight **merino crew neck**, knitted in Italy and finished in Portugal.',
      '',
      '### Composition',
      '',
      '- 100% extra-fine merino wool',
      '- Machine washable at 30°C',
      '- Made in Portugal',
      '',
      'See the [care guide](https://example.com/care) for more.',
    ].join('\n'),
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof RichText>;

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: '42rem' }}>
      <RichText {...args} />
    </div>
  ),
};

/** The full range of markdown a CMS field tends to produce. */
export const Kitchen: Story = {
  args: {
    body: [
      '# Heading one',
      '## Heading two',
      '### Heading three',
      '',
      'Paragraph copy with **bold**, _italic_, `inline code` and a [link](https://example.com).',
      '',
      '1. Ordered item',
      '2. Another one',
      '',
      '- Unordered item',
      '- Another one',
      '',
      '> A block quote.',
    ].join('\n'),
  },
  render: (args) => (
    <div style={{ maxWidth: '42rem' }}>
      <RichText {...args} />
    </div>
  ),
};

/**
 * Output is sanitised before it reaches the DOM, so hostile markup in an authored
 * field is dropped rather than executed. The script and the `onerror` below never
 * run; the safe formatting around them survives.
 */
export const HostileInputIsSanitised: Story = {
  args: {
    body: [
      'This copy is **fine**.',
      '',
      '<script>window.__pwned = true;</script>',
      '',
      '<img src="x" onerror="window.__pwned = true">',
      '',
      '<a href="javascript:alert(1)">Not a real link</a>',
    ].join('\n'),
  },
  render: (args) => (
    <div style={{ maxWidth: '42rem' }}>
      <RichText {...args} />
    </div>
  ),
};

/** Nothing renders at all for an empty field. */
export const Empty: Story = {
  args: { body: '' },
};
