import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SearchField } from './SearchField';

describe('SearchField', () => {
  it('renders a labelled search input', () => {
    render(
      <SearchField
        id="contact-search"
        label="Search contacts"
        placeholder="Search…"
        value=""
        onChange={() => {}}
      />,
    );

    expect(screen.getByRole('searchbox', { name: 'Search contacts' })).toBeInTheDocument();
  });

  it('emits the value on change', () => {
    const onChange = vi.fn();
    render(
      <SearchField
        id="contact-search"
        label="Search contacts"
        placeholder="Search…"
        value=""
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'jordan' } });

    expect(onChange).toHaveBeenCalledWith('jordan');
  });
});
