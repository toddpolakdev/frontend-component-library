import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HighlightedText } from './HighlightedText';

describe('HighlightedText', () => {
  it('renders plain text when the search term is empty', () => {
    render(<HighlightedText text="Hello world" searchTerm="   " />);

    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(document.querySelector('mark')).toBeNull();
  });

  it('wraps matches in a mark element', () => {
    render(<HighlightedText text="Jordan Smith" searchTerm="smith" />);

    const marks = document.querySelectorAll('mark');
    expect(marks).toHaveLength(1);
    expect(marks[0]).toHaveTextContent('Smith');
  });

  it('highlights every case-insensitive occurrence', () => {
    render(<HighlightedText text="aaa AAA aaa" searchTerm="aaa" />);

    expect(document.querySelectorAll('mark')).toHaveLength(3);
  });

  it('treats regex-special characters literally', () => {
    render(<HighlightedText text="total (net) is 5" searchTerm="(net)" />);

    const marks = document.querySelectorAll('mark');
    expect(marks).toHaveLength(1);
    expect(marks[0]).toHaveTextContent('(net)');
  });
});
