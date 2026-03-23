import '@testing-library/jest-dom/vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PrimaryButton } from './PrimaryButton';

describe('PrimaryButton', () => {
  it('renders its label and supports an aria label', () => {
    render(<PrimaryButton ariaLabel="Save changes">Save</PrimaryButton>);

    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeVisible();
  });

  it('disables interaction when disabled', () => {
    const handleClick = vi.fn();
    render(
      <PrimaryButton disabled onClick={handleClick}>
        Disabled
      </PrimaryButton>,
    );

    const button = screen.getByRole('button', { name: 'Disabled' });
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows a spinner and sets aria-busy while loading', () => {
    render(<PrimaryButton isLoading>Submitting</PrimaryButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    expect(screen.getByText('Loading')).toHaveClass('sr-only');
  });

  it('renders icon content alongside text', () => {
    render(
      <PrimaryButton icon={<span data-testid="icon">+</span>}>
        Add item
      </PrimaryButton>,
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
  });

  it('supports right-aligned icons', () => {
    render(
      <PrimaryButton icon={<span data-testid="right-icon">→</span>} iconPosition="right">
        Continue
      </PrimaryButton>,
    );

    const content = screen.getByRole('button', { name: 'Continue' }).textContent;
    expect(content).toContain('Continue');
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });
});
