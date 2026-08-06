import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge>Client</Badge>);

    expect(screen.getByText('Client')).toBeInTheDocument();
  });

  it('defaults to the client variant', () => {
    render(<Badge>Client</Badge>);

    expect(screen.getByText('Client')).toHaveAttribute('data-variant', 'client');
  });

  it('reflects the selected variant via a data attribute', () => {
    render(<Badge variant="admin">Admin</Badge>);

    expect(screen.getByText('Admin')).toHaveAttribute('data-variant', 'admin');
  });
});
