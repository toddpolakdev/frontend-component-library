import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { SelectField } from './SelectField';

const options = [
  { label: 'Client', value: 'Client' },
  { label: 'Lead', value: 'Lead' },
  { label: 'Vendor', value: 'Vendor' },
  { label: 'Partner', value: 'Partner' },
];

const meta: Meta<typeof SelectField> = {
  title: 'Components/SelectField',
  component: SelectField,
  args: {
    id: 'category',
    label: 'Contact Type',
    value: 'Client',
    options,
    required: true,
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SelectField>;

const Controlled = (args: Parameters<typeof SelectField>[0]) => {
  const [value, setValue] = useState(args.value);
  return (
    <div style={{ width: '20rem' }}>
      <SelectField {...args} value={value} onChange={setValue} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
};

export const WithError: Story = {
  args: {
    value: '',
    error: 'Contact type is required.',
  },
  render: (args) => <Controlled {...args} />,
};
