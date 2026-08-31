import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RichText } from './RichText';

describe('RichText', () => {
  it('renders markdown as real elements', () => {
    render(<RichText body={'# Heading\n\nSome **bold** copy.'} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Heading' })).toBeInTheDocument();
    expect(screen.getByText('bold').tagName).toBe('STRONG');
  });

  it('renders lists and links', () => {
    render(<RichText body={'- First\n- Second\n\n[Docs](https://example.com)'} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute(
      'href',
      'https://example.com',
    );
  });

  it('renders nothing without a body', () => {
    const { container: empty } = render(<RichText />);
    expect(empty).toBeEmptyDOMElement();

    const { container: blank } = render(<RichText body="" />);
    expect(blank).toBeEmptyDOMElement();

    const { container: nulled } = render(<RichText body={null} />);
    expect(nulled).toBeEmptyDOMElement();
  });

  it('renders into a block element, not a paragraph', () => {
    // Markdown emits block elements, and <p><ul> is invalid — the browser would
    // close the outer <p> early and break the structure, as the source did.
    const { container } = render(<RichText body="Just copy" />);

    expect(container.firstElementChild?.tagName).toBe('DIV');
  });

  it('can render into another block element', () => {
    const { container } = render(<RichText body="Copy" as="section" />);

    expect(container.firstElementChild?.tagName).toBe('SECTION');
  });

  it('strips script tags from the markdown', () => {
    const { container } = render(
      <RichText body={'Hello\n\n<script>window.__pwned = true;</script>'} />,
    );

    expect(container.querySelector('script')).toBeNull();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('strips inline event handlers', () => {
    const { container } = render(<RichText body={'<img src="x" onerror="alert(1)">'} />);

    const img = container.querySelector('img');
    expect(img?.getAttribute('onerror')).toBeNull();
  });

  it('strips javascript: URLs from links', () => {
    const { container } = render(<RichText body={'<a href="javascript:alert(1)">Click</a>'} />);

    const href = container.querySelector('a')?.getAttribute('href') ?? '';
    expect(href.toLowerCase()).not.toContain('javascript:');
  });

  it('keeps safe inline HTML that authors legitimately use', () => {
    render(<RichText body={'Some <em>emphasis</em> and <code>code</code>.'} />);

    expect(screen.getByText('emphasis').tagName).toBe('EM');
    expect(screen.getByText('code').tagName).toBe('CODE');
  });

  it('spreads DOM props', () => {
    const { container } = render(
      <RichText body="Copy" id="product-description" className="narrow" />,
    );

    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('id', 'product-description');
    expect(root).toHaveClass('narrow');
  });
});
