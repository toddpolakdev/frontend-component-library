import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SelectField } from './SelectField';

const options = [
  { label: 'Client', value: 'Client' },
  { label: 'Lead', value: 'Lead' },
];

describe('SelectField', () => {
  it('renders options and reflects the selected value', () => {
    render(
      <SelectField id="category" label="Contact Type" value="Lead" options={options} onChange={() => {}} />,
    );

    expect(screen.getByRole('combobox', { name: /contact type/i })).toHaveValue('Lead');
  });

  it('emits the selected value on change', () => {
    const onChange = vi.fn();
    render(
      <SelectField id="category" label="Contact Type" value="Client" options={options} onChange={onChange} />,
    );

    fireEvent.change(screen.getByRole('combobox', { name: /contact type/i }), {
      target: { value: 'Lead' },
    });

    expect(onChange).toHaveBeenCalledWith('Lead');
  });

  it('keeps the accessible name when the label is visually hidden', () => {
    // Covers the case the source's DropdownSelect handled by shipping no label
    // at all, leaving the select with no accessible name.
    render(
      <SelectField
        id="sort"
        label="Sort by"
        value="Client"
        options={options}
        hideLabel
        onChange={() => {}}
      />,
    );

    expect(screen.getByRole('combobox', { name: 'Sort by' })).toBeInTheDocument();
  });

  it('exposes accessible error wiring', () => {
    render(
      <SelectField
        id="category"
        label="Contact Type"
        value=""
        options={options}
        error="Contact type is required."
        onChange={() => {}}
      />,
    );

    const select = screen.getByRole('combobox', { name: /contact type/i });
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(select).toHaveAttribute('aria-describedby', 'category-error');
  });
});
