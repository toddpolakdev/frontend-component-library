import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ThemeToggle } from './ThemeToggle';

beforeEach(() => {
  window.localStorage.removeItem('theme');
  document.documentElement.removeAttribute('data-theme');
});

afterEach(() => {
  window.localStorage.removeItem('theme');
  document.documentElement.removeAttribute('data-theme');
});

describe('ThemeToggle', () => {
  it('defaults to light and offers to switch to dark', () => {
    render(<ThemeToggle />);

    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  it('toggles to dark mode, persisting and reflecting the choice', () => {
    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }));

    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(window.localStorage.getItem('theme')).toBe('dark');
  });

  it('reads an already-saved theme on mount', () => {
    window.localStorage.setItem('theme', 'dark');

    render(<ThemeToggle />);

    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument();
  });
});
