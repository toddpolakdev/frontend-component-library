import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  it('renders the message', () => {
    render(<ErrorMessage message="Could not save your changes." />);

    expect(screen.getByText('Could not save your changes.')).toBeInTheDocument();
  });

  it('announces itself as an alert', () => {
    // The source was a plain div, so a failed submission was silent to AT.
    render(<ErrorMessage message="Could not save your changes." />);

    expect(screen.getByRole('alert')).toHaveTextContent('Could not save your changes.');
  });

  it('lists the details underneath', () => {
    render(
      <ErrorMessage
        message="Check the form."
        details={['Email is required', 'Postcode is not valid']}
      />,
    );

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Email is required');
    expect(items[1]).toHaveTextContent('Postcode is not valid');
  });

  it('renders no list when there are no details', () => {
    const { rerender } = render(<ErrorMessage message="Failed." />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    rerender(<ErrorMessage message="Failed." details={[]} />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('spreads DOM props', () => {
    render(<ErrorMessage message="Failed." id="checkout-error" className="wide" />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('id', 'checkout-error');
    expect(alert).toHaveClass('wide');
  });
});
