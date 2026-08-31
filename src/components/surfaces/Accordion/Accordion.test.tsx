import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Accordion } from './Accordion';

const toggle = (name = 'Shipping') => screen.getByRole('button', { name });

describe('Accordion', () => {
  it('renders its title and starts collapsed', () => {
    render(<Accordion title="Shipping">Ships in 2 days</Accordion>);

    expect(toggle()).toHaveAttribute('aria-expanded', 'false');

    // `visibility: hidden` has to keep the collapsed panel out of the
    // accessibility tree and the tab order, not merely clip it.
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { hidden: true })).toBeInTheDocument();
    expect(screen.getByText('Ships in 2 days')).not.toBeVisible();
  });

  it('opens and closes on click', () => {
    render(<Accordion title="Shipping">Ships in 2 days</Accordion>);

    fireEvent.click(toggle());
    expect(toggle()).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(toggle());
    expect(toggle()).toHaveAttribute('aria-expanded', 'false');
  });

  it('is a real button, so the keyboard works', () => {
    // The source rendered a <div onClick>: unfocusable and unusable via keyboard.
    render(<Accordion title="Shipping">Ships in 2 days</Accordion>);

    const button = toggle();
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');

    button.focus();
    expect(button).toHaveFocus();

    // Enter and Space fire click on a native button.
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('wires the header to the panel', () => {
    render(<Accordion title="Shipping">Ships in 2 days</Accordion>);

    fireEvent.click(toggle());

    const panel = screen.getByRole('region');
    expect(toggle()).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', toggle().id);
    expect(panel).toHaveAccessibleName('Shipping');
  });

  it('swaps the icon between states', () => {
    const { container } = render(<Accordion title="Shipping">Ships in 2 days</Accordion>);
    const iconVariant = () => container.querySelector('svg')?.getAttribute('data-variant');

    expect(iconVariant()).toBe('Plus');

    fireEvent.click(toggle());
    expect(iconVariant()).toBe('Minus');
  });

  it('accepts custom icons', () => {
    const { container } = render(
      <Accordion title="Shipping" iconClosed="ChevronDown" iconOpened="ChevronUp">
        Ships in 2 days
      </Accordion>,
    );

    expect(container.querySelector('svg')).toHaveAttribute('data-variant', 'ChevronDown');

    fireEvent.click(toggle());
    expect(container.querySelector('svg')).toHaveAttribute('data-variant', 'ChevronUp');
  });

  // The source's separate `Collapse` component was this same disclosure with a
  // rotating chevron ahead of the title, so it lives here as two props.
  it('rotates a single icon instead of swapping, when asked', () => {
    const { container } = render(
      <Accordion title="Shipping" rotateIcon>
        Ships in 2 days
      </Accordion>,
    );
    const iconVariant = () => container.querySelector('svg')?.getAttribute('data-variant');

    // A rotated Plus would look identical rotated or not, so rotating defaults
    // to a directional glyph.
    expect(iconVariant()).toBe('ChevronRight');

    fireEvent.click(toggle());

    // Same glyph either way — the CSS turns it.
    expect(iconVariant()).toBe('ChevronRight');
  });

  it('still honours an explicit icon while rotating', () => {
    const { container } = render(
      <Accordion title="Shipping" rotateIcon iconClosed="ChevronDown">
        Ships in 2 days
      </Accordion>,
    );

    expect(container.querySelector('svg')).toHaveAttribute('data-variant', 'ChevronDown');
  });

  it('can put the icon before the title', () => {
    const { container } = render(
      <Accordion title="Shipping" rotateIcon iconPosition="start">
        Ships in 2 days
      </Accordion>,
    );

    const header = toggle();
    const icon = container.querySelector('svg')!;
    const titleText = screen.getByText('Shipping');

    // Icon precedes the title in DOM order.
    expect(header.firstElementChild).toContainElement(icon);
    expect(
      icon.compareDocumentPosition(titleText) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('defaults the icon to after the title', () => {
    const { container } = render(<Accordion title="Shipping">Ships in 2 days</Accordion>);

    const icon = container.querySelector('svg')!;
    const titleText = screen.getByText('Shipping');

    expect(
      titleText.compareDocumentPosition(icon) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('can start open', () => {
    render(
      <Accordion title="Shipping" defaultOpen>
        Ships in 2 days
      </Accordion>,
    );

    expect(toggle()).toHaveAttribute('aria-expanded', 'true');
  });

  it('honours a controlled open prop', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Accordion title="Shipping" open={false} onOpenChange={onOpenChange}>
        Ships in 2 days
      </Accordion>,
    );

    fireEvent.click(toggle());

    // Controlled: it reports the request but doesn't move on its own.
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(toggle()).toHaveAttribute('aria-expanded', 'false');

    rerender(
      <Accordion title="Shipping" open onOpenChange={onOpenChange}>
        Ships in 2 days
      </Accordion>,
    );
    expect(toggle()).toHaveAttribute('aria-expanded', 'true');
  });

  it('reports changes in uncontrolled mode too', () => {
    const onOpenChange = vi.fn();
    render(
      <Accordion title="Shipping" onOpenChange={onOpenChange}>
        Ships in 2 days
      </Accordion>,
    );

    fireEvent.click(toggle());
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(toggle()).toHaveAttribute('aria-expanded', 'true');
  });

  it('does nothing when disabled', () => {
    const onOpenChange = vi.fn();
    render(
      <Accordion title="Shipping" disabled onOpenChange={onOpenChange}>
        Ships in 2 days
      </Accordion>,
    );

    expect(toggle()).toBeDisabled();

    fireEvent.click(toggle());
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(toggle()).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps ids unique across instances', () => {
    render(
      <>
        <Accordion title="First">One</Accordion>
        <Accordion title="Second">Two</Accordion>
      </>,
    );

    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });

    expect(first.getAttribute('aria-controls')).not.toBe(second.getAttribute('aria-controls'));
  });

  it('supports a one-open-at-a-time group', () => {
    function Group() {
      const [openId, setOpenId] = useState<string | null>('a');
      return (
        <>
          {[
            { id: 'a', title: 'First' },
            { id: 'b', title: 'Second' },
          ].map((section) => (
            <Accordion
              key={section.id}
              title={section.title}
              open={openId === section.id}
              onOpenChange={(next) => setOpenId(next ? section.id : null)}
            >
              {section.title} content
            </Accordion>
          ))}
        </>
      );
    }

    render(<Group />);

    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Second' }));

    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders arbitrary children, not just text', () => {
    render(
      <Accordion title="Details" defaultOpen>
        <ul>
          <li>Free returns</li>
        </ul>
      </Accordion>,
    );

    expect(screen.getByRole('listitem')).toHaveTextContent('Free returns');
  });
});
