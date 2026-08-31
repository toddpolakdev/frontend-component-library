import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Text } from './Text';

describe('Text', () => {
  it('renders body copy in a div by default', () => {
    render(<Text>Just some copy</Text>);

    const text = screen.getByText('Just some copy');
    expect(text.tagName).toBe('DIV');
    expect(text).toHaveAttribute('data-variant', 'body');
  });

  it('gives each variant a sensible default element', () => {
    render(
      <>
        <Text variant="heading">Heading</Text>
        <Text variant="pageHeading">Page heading</Text>
        <Text variant="sectionHeading">Section heading</Text>
      </>,
    );

    expect(screen.getByText('Heading').tagName).toBe('H1');
    expect(screen.getByText('Page heading').tagName).toBe('H1');
    expect(screen.getByText('Section heading').tagName).toBe('H2');
  });

  it('separates semantics from appearance via as', () => {
    render(
      <Text variant="pageHeading" as="h2">
        Styled like a page heading, ranked as h2
      </Text>,
    );

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('data-variant', 'pageHeading');
  });

  it('can render body copy as a paragraph', () => {
    render(
      <Text as="p">Inline prose</Text>,
    );

    expect(screen.getByText('Inline prose').tagName).toBe('P');
  });

  it('renders nested markup as children', () => {
    render(
      <Text>
        <h3>Nested heading</h3>
        <ul>
          <li>First</li>
        </ul>
      </Text>,
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Nested heading' })).toBeInTheDocument();
    expect(screen.getByRole('listitem')).toHaveTextContent('First');
  });

  it('escapes markup passed as a string instead of injecting it', () => {
    const { container } = render(<Text>{'<img src=x onerror="alert(1)">'}</Text>);

    // The dropped `html`/dangerouslySetInnerHTML prop would have executed this.
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('<img src=x onerror="alert(1)">')).toBeInTheDocument();
  });

  it('forwards a ref and spreads DOM props', () => {
    const ref = createRef<HTMLElement>();
    const onClick = vi.fn();

    render(
      <Text ref={ref} id="intro" aria-label="Introduction" onClick={onClick}>
        Copy
      </Text>,
    );

    expect(ref.current).toBe(screen.getByText('Copy'));
    expect(ref.current).toHaveAttribute('id', 'intro');
    expect(ref.current).toHaveAttribute('aria-label', 'Introduction');

    fireEvent.click(screen.getByText('Copy'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('keeps caller classNames alongside its own styles', () => {
    render(
      <Text variant="heading" className="hero-title">
        Title
      </Text>,
    );

    expect(screen.getByText('Title')).toHaveClass('hero-title');
  });
});
