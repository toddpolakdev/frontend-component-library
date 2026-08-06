import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PageLoader } from './PageLoader';

describe('PageLoader', () => {
  it('exposes a polite live status region', () => {
    render(<PageLoader />);

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  it('renders the default mark and label', () => {
    render(<PageLoader />);

    expect(screen.getByText('Loading workspace')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('R')).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('supports a custom mark and label', () => {
    render(<PageLoader mark="AB" label="Please wait" />);

    expect(screen.getByText('Please wait')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });
});
