import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ContactEntry } from './ContactEntry';

function fillRequiredFields() {
  fireEvent.change(screen.getByRole('textbox', { name: /first name/i }), {
    target: { value: 'Jordan' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: /last name/i }), {
    target: { value: 'Smith' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
    target: { value: 'jordan@example.com' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: /phone/i }), {
    target: { value: '6145550142' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: /company/i }), {
    target: { value: 'Brightside' },
  });
}

describe('ContactEntry', () => {
  it('renders all contact fields', () => {
    render(<ContactEntry onSubmit={() => {}} onCancel={() => {}} />);

    expect(screen.getByRole('textbox', { name: /first name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /last name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /phone/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /company/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /contact type/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /notes/i })).toBeInTheDocument();
  });

  it('formats the phone number as the user types', () => {
    render(<ContactEntry onSubmit={() => {}} onCancel={() => {}} />);

    fireEvent.change(screen.getByRole('textbox', { name: /phone/i }), {
      target: { value: '6145550142' },
    });

    expect(screen.getByRole('textbox', { name: /phone/i })).toHaveValue('(614) 555-0142');
  });

  it('blocks submission and surfaces errors when required fields are empty', () => {
    const onSubmit = vi.fn();
    render(<ContactEntry onSubmit={onSubmit} onCancel={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /save contact/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('First name is required.')).toBeInTheDocument();
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
  });

  it('submits normalized values when the form is valid', () => {
    const onSubmit = vi.fn();
    render(<ContactEntry onSubmit={onSubmit} onCancel={() => {}} />);

    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: /save contact/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      firstName: 'Jordan',
      lastName: 'Smith',
      email: 'jordan@example.com',
      phone: '(614) 555-0142',
      company: 'Brightside',
      category: 'Client',
      notes: '',
    });
  });

  it('calls onCancel when the cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<ContactEntry onSubmit={() => {}} onCancel={onCancel} />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
