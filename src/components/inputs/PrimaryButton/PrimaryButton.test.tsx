import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PrimaryButton } from './PrimaryButton';

describe('PrimaryButton', () => {
  it('renders its label and supports an explicit aria label', () => {
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
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows a spinner, announces loading, and disables interaction while loading', () => {
    render(<PrimaryButton isLoading loadingLabel="Submitting form">Submitting</PrimaryButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    expect(screen.getByText('Submitting form')).toBeInTheDocument();
  });

  it('renders icon content alongside text', () => {
    render(
      <PrimaryButton icon={<span data-testid="left-icon">+</span>}>
        Add item
      </PrimaryButton>,
    );

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
  });

  it('supports right-aligned icons', () => {
    render(
      <PrimaryButton icon={<span data-testid="right-icon">→</span>} iconPosition="right">
        Continue
      </PrimaryButton>,
    );

    expect(screen.getByRole('button', { name: 'Continue' })).toHaveTextContent('Continue');
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('supports opting out of full-width mobile layout', () => {
    render(<PrimaryButton fullWidthOnMobile={false}>Inline</PrimaryButton>);

    expect(screen.getByRole('button', { name: 'Inline' })).not.toHaveAttribute('data-full-width');
  });

  it('applies the selected theme mode as metadata', () => {
    render(<PrimaryButton themeMode="dark">Dark action</PrimaryButton>);

    const button = screen.getByRole('button', { name: 'Dark action' });
    expect(button).toHaveAttribute('data-theme-mode', 'dark');
  });
});
