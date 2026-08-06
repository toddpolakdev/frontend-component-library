import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { SearchField } from './SearchField';

const meta: Meta<typeof SearchField> = {
  title: 'Components/SearchField',
  component: SearchField,
  args: {
    id: 'contact-search',
    label: 'Search contacts',
    placeholder: 'Search by name, company, or email',
    value: '',
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SearchField>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <div style={{ width: '24rem' }}>
        <SearchField {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};
