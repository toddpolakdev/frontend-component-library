import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Container } from './Container';

describe('Container', () => {
  it('renders its children in a div by default', () => {
    render(<Container>Page content</Container>);

    expect(screen.getByText('Page content').tagName).toBe('DIV');
  });

  it('can render as another element', () => {
    render(<Container as="main">Page content</Container>);

    expect(screen.getByRole('main')).toHaveTextContent('Page content');
  });

  it('spreads DOM props', () => {
    render(
      <Container id="page" className="tinted" aria-label="Page">
        Content
      </Container>,
    );

    const container = screen.getByLabelText('Page');
    expect(container).toHaveAttribute('id', 'page');
    expect(container).toHaveClass('tinted');
  });

  it('accepts fullWidth and a custom max width without complaint', () => {
    // The visual effect is CSS, which jsdom can't resolve from a styled class —
    // this covers the prop plumbing.
    render(
      <Container fullWidth maxWidth="60rem">
        Edge to edge
      </Container>,
    );

    expect(screen.getByText('Edge to edge')).toBeInTheDocument();
  });
});
