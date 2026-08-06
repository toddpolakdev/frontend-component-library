import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Clock } from './Clock';

describe('Clock', () => {
  it('renders the current time and date', () => {
    render(<Clock locale="en-US" />);

    // Time formatted as h:mm (e.g. "10:30 AM").
    expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeInTheDocument();
    // Date includes a short weekday name.
    expect(
      screen.getByText(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/),
    ).toBeInTheDocument();
  });

  it('exposes a timer role', () => {
    render(<Clock />);

    expect(screen.getByRole('timer')).toBeInTheDocument();
  });
});
