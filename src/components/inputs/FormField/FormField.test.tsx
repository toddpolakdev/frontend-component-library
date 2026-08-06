import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FormField } from './FormField';

describe('FormField', () => {
  it('renders a labelled input and marks required fields', () => {
    render(<FormField id="firstName" label="First Name" value="" required onChange={() => {}} />);

    expect(screen.getByRole('textbox', { name: /first name/i })).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('emits the raw value on change', () => {
    const onChange = vi.fn();
    render(<FormField id="email" label="Email" type="email" value="" onChange={onChange} />);

    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'a@b.co' },
    });

    expect(onChange).toHaveBeenCalledWith('a@b.co');
  });

  it('exposes an accessible error and links it to the input', () => {
    render(
      <FormField
        id="email"
        label="Email"
        value=""
        error="Enter a valid email address."
        onChange={() => {}}
      />,
    );

    const input = screen.getByRole('textbox', { name: /email/i });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
    expect(screen.getByText('Enter a valid email address.')).toHaveAttribute('id', 'email-error');
  });
});
