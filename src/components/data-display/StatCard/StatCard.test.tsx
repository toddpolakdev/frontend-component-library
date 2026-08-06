import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StatCard } from './StatCard';

describe('StatCard', () => {
  it('renders the title, value, description, and icon', () => {
    render(
      <StatCard
        title="Total Contacts"
        value="1,248"
        description="Up 12% from last month"
        icon={<span data-testid="icon">👥</span>}
      />,
    );

    expect(screen.getByText('Total Contacts')).toBeInTheDocument();
    expect(screen.getByText('1,248')).toBeInTheDocument();
    expect(screen.getByText('Up 12% from last month')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('defaults to the blue variant', () => {
    const { container } = render(
      <StatCard title="Contacts" value="1" description="desc" icon="👥" />,
    );

    expect(container.querySelector('[data-variant="blue"]')).toBeInTheDocument();
  });

  it('reflects the selected variant via a data attribute', () => {
    const { container } = render(
      <StatCard title="Revenue" value="$94k" description="desc" icon="💰" variant="pink" />,
    );

    expect(container.querySelector('[data-variant="pink"]')).toBeInTheDocument();
  });
});
