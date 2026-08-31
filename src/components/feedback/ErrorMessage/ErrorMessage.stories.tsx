import type { Meta, StoryObj } from '@storybook/react';

import { ErrorMessage } from './ErrorMessage';

const meta: Meta<typeof ErrorMessage> = {
  title: 'Components/ErrorMessage',
  component: ErrorMessage,
  args: {
    message: 'We could not save your changes.',
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof ErrorMessage>;

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <ErrorMessage {...args} />
    </div>
  ),
};

/** Field-level problems listed under the headline. */
export const WithDetails: Story = {
  args: {
    message: 'Check the highlighted fields.',
    details: [
      'Email address is required',
      'Postcode is not a valid UK postcode',
      'Card expiry must be in the future',
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <ErrorMessage {...args} />
    </div>
  ),
};

/** Mapping an API error shape onto the component. */
export const FromAnApiError: Story = {
  render: () => {
    const apiError = {
      message: 'Order could not be placed.',
      code: 'PAYMENT_DECLINED',
      errors: [{ message: 'Card was declined by the issuer' }, { message: 'Try another card' }],
    };

    return (
      <div style={{ maxWidth: '32rem' }}>
        <ErrorMessage
          message={apiError.message}
          details={apiError.errors.map((error) => error.message)}
        />
      </div>
    );
  },
};
