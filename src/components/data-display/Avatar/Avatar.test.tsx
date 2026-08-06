import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders two-letter initials from a full name', () => {
    render(<Avatar name="Ada Lovelace" />);

    expect(screen.getByText('AL')).toBeInTheDocument();
  });

  it('handles a single name', () => {
    render(<Avatar name="Cher" />);

    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('ignores extra whitespace between name parts', () => {
    render(<Avatar name="  Alan   Turing  " />);

    expect(screen.getByText('AT')).toBeInTheDocument();
  });

  it('exposes an accessible label derived from the name', () => {
    render(<Avatar name="Grace Hopper" />);

    expect(screen.getByLabelText('Grace Hopper avatar')).toBeInTheDocument();
  });
});
