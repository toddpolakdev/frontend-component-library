import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { FormField } from './FormField';

const meta: Meta<typeof FormField> = {
  title: 'Components/FormField',
  component: FormField,
  args: {
    id: 'first-name',
    label: 'First Name',
    value: '',
    placeholder: 'Jordan',
    required: true,
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

const Controlled = (args: Parameters<typeof FormField>[0]) => {
  const [value, setValue] = useState(args.value);
  return (
    <div style={{ width: '20rem' }}>
      <FormField {...args} value={value} onChange={setValue} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
};

export const WithError: Story = {
  args: {
    id: 'email',
    label: 'Email',
    type: 'email',
    value: 'not-an-email',
    placeholder: 'jordan@example.com',
    error: 'Enter a valid email address.',
  },
  render: (args) => <Controlled {...args} />,
};
