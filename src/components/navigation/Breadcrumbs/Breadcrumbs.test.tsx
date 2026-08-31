import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Breadcrumbs } from './Breadcrumbs';

const ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Backpacks', href: '/collections/backpacks' },
  { label: 'Campus Backpack' },
];

describe('Breadcrumbs', () => {
  it('renders a labelled navigation landmark with a list', () => {
    // The source emitted a bare div of spans: no landmark, no list structure.
    render(<Breadcrumbs items={ITEMS} />);

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('takes a custom landmark label', () => {
    render(<Breadcrumbs items={ITEMS} label="You are here" />);

    expect(screen.getByRole('navigation', { name: 'You are here' })).toBeInTheDocument();
  });

  it('links every step except the last', () => {
    render(<Breadcrumbs items={ITEMS} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/');
    expect(links[1]).toHaveAttribute('href', '/collections/backpacks');
  });

  it('marks the last step as the current page', () => {
    render(<Breadcrumbs items={ITEMS} />);

    const current = screen.getByText('Campus Backpack');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current.tagName).not.toBe('A');
  });

  it('does not link the last step even when it has an href', () => {
    render(<Breadcrumbs items={[ITEMS[0], { label: 'Backpacks', href: '/b' }]} />);

    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByText('Backpacks')).toHaveAttribute('aria-current', 'page');
  });

  it('renders a step without an href as plain text', () => {
    render(
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Archive' }, { label: 'Item' }]} />,
    );

    expect(screen.getByText('Archive').tagName).not.toBe('A');
    expect(screen.getByText('Archive')).not.toHaveAttribute('aria-current');
  });

  it('hides separators from assistive tech', () => {
    // The source's separator was plain text, so screen readers said "slash".
    const { container } = render(<Breadcrumbs items={ITEMS} />);

    const separators = container.querySelectorAll('[aria-hidden="true"]');
    expect(separators).toHaveLength(2);
    expect(separators[0]).toHaveTextContent('/');
  });

  it('takes a custom separator', () => {
    const { container } = render(<Breadcrumbs items={ITEMS} separator="›" />);

    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('›');
  });

  it('leaves no dangling separator on a single step', () => {
    // The source rendered "Home / " with nothing after it when given no category.
    const { container } = render(<Breadcrumbs items={[{ label: 'Home' }]} />);

    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
    expect(screen.getByText('Home')).toHaveAttribute('aria-current', 'page');
  });

  it('renders nothing without items', () => {
    const { container } = render(<Breadcrumbs items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
