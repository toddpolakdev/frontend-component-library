import type { Meta, StoryObj } from '@storybook/react';

import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  args: {
    variant: 'body',
    children: 'The quick brown fox jumps over the lazy dog.',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['heading', 'pageHeading', 'sectionHeading', 'body'],
    },
    as: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {};

/** The whole scale, top to bottom. */
export const Scale: Story = {
  render: () => (
    <div>
      <Text variant="heading">heading</Text>
      <Text variant="pageHeading">pageHeading</Text>
      <Text variant="sectionHeading">sectionHeading</Text>
      <Text variant="body">
        body — the base step, used for prose. Sits at a comfortable reading line-height.
      </Text>
    </div>
  ),
};

/**
 * `variant` sets the look, `as` sets the element. Both `heading` and
 * `pageHeading` default to `h1`, so `as` is how you keep one `h1` per page.
 */
export const SemanticsVsAppearance: Story = {
  render: () => (
    <div>
      <Text variant="pageHeading">Default — renders an h1</Text>
      <Text variant="pageHeading" as="h2">
        Same look, renders an h2
      </Text>
      <Text variant="sectionHeading" as="h3">
        sectionHeading look, ranked h3
      </Text>
    </div>
  ),
};

/** Nested markup inside `body` picks up the prose styles automatically. */
export const RichContent: Story = {
  render: () => (
    <Text variant="body" style={{ maxWidth: '42rem' }}>
      <h2>A heading inside body copy</h2>
      <p>
        Paragraphs, headings and lists nested inside the <code>body</code> variant are styled
        without needing classes of their own — handy for content coming out of an editor.
      </p>
      <h3>A subheading</h3>
      <ul>
        <li>Unordered items get discs</li>
        <li>
          and <a href="#top">links are underlined</a>
        </li>
      </ul>
      <ol>
        <li>Ordered items get numbers</li>
      </ol>
    </Text>
  ),
};
