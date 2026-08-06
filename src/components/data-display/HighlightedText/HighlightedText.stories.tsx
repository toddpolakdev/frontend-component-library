import type { Meta, StoryObj } from '@storybook/react';

import { HighlightedText } from './HighlightedText';

const meta: Meta<typeof HighlightedText> = {
  title: 'Components/HighlightedText',
  component: HighlightedText,
  args: {
    text: 'Jordan Smith — Brightside Consulting',
    searchTerm: 'smith',
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof HighlightedText>;

export const Default: Story = {};

export const MultipleMatches: Story = {
  args: {
    text: 'aaa bbb aaa ccc aaa',
    searchTerm: 'aaa',
  },
};

export const NoMatch: Story = {
  args: {
    text: 'Nothing to highlight here',
    searchTerm: 'zzz',
  },
};
