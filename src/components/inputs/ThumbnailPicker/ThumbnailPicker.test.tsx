import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ThumbnailPicker, type ThumbnailOption } from './ThumbnailPicker';

const OPTIONS: ThumbnailOption[] = [
  { value: 'one-character', image: '/one.gif', label: 'One Character' },
  { value: 'name', image: '/name.gif', label: 'Name' },
  { value: 'monogram', image: '/monogram.gif', label: 'Monogram' },
];

const option = (name: string) => screen.getByRole('radio', { name });

describe('ThumbnailPicker', () => {
  it('renders one option per thumbnail', () => {
    render(<ThumbnailPicker options={OPTIONS} />);

    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('names each option from its label', () => {
    render(<ThumbnailPicker options={OPTIONS} />);

    for (const { label } of OPTIONS) {
      expect(option(label)).toBeInTheDocument();
    }
  });

  it('reports the selection to the caller', () => {
    // The source kept this in internal state with no way out, so a host app
    // could never find out what the user picked.
    const onChange = vi.fn();
    render(<ThumbnailPicker options={OPTIONS} onChange={onChange} />);

    fireEvent.click(option('Monogram'));

    expect(onChange).toHaveBeenCalledWith('monogram');
  });

  it('starts with nothing selected', () => {
    render(<ThumbnailPicker options={OPTIONS} />);

    for (const { label } of OPTIONS) {
      expect(option(label)).not.toBeChecked();
    }
  });

  it('tracks the selection when uncontrolled', () => {
    render(<ThumbnailPicker options={OPTIONS} defaultValue="name" />);

    expect(option('Name')).toBeChecked();

    fireEvent.click(option('Monogram'));

    expect(option('Monogram')).toBeChecked();
    expect(option('Name')).not.toBeChecked();
  });

  it('obeys a controlled value', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <ThumbnailPicker options={OPTIONS} value="name" onChange={onChange} />,
    );

    fireEvent.click(option('Monogram'));

    // Reports the request but doesn't move itself.
    expect(onChange).toHaveBeenCalledWith('monogram');
    expect(option('Name')).toBeChecked();

    rerender(<ThumbnailPicker options={OPTIONS} value="monogram" onChange={onChange} />);
    expect(option('Monogram')).toBeChecked();
  });

  it('uses native radios sharing one name, which is what makes arrow keys work', () => {
    render(<ThumbnailPicker options={OPTIONS} />);

    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    const names = new Set(radios.map((radio) => radio.name));

    for (const radio of radios) {
      expect(radio.tagName).toBe('INPUT');
      expect(radio.type).toBe('radio');
    }
    expect(names.size).toBe(1);
  });

  it('keeps group names distinct between pickers', () => {
    render(
      <>
        <ThumbnailPicker options={OPTIONS} heading="First" />
        <ThumbnailPicker options={OPTIONS} heading="Second" />
      </>,
    );

    const names = new Set(
      (screen.getAllByRole('radio') as HTMLInputElement[]).map((radio) => radio.name),
    );

    expect(names.size).toBe(2);
  });

  it('takes an explicit group name', () => {
    render(<ThumbnailPicker options={OPTIONS} name="monogram-style" />);

    for (const radio of screen.getAllByRole('radio') as HTMLInputElement[]) {
      expect(radio.name).toBe('monogram-style');
    }
  });

  it('labels the group with its heading', () => {
    render(<ThumbnailPicker options={OPTIONS} heading="Step 1: Choose your style" />);

    expect(
      screen.getByRole('group', { name: 'Step 1: Choose your style' }),
    ).toBeInTheDocument();
  });

  it('hides captions unless asked', () => {
    const { rerender } = render(<ThumbnailPicker options={OPTIONS} />);

    // Only the aria-label and the aria-hidden tooltip carry the text.
    expect(screen.queryByText('One Character', { ignore: '[aria-hidden]' })).toBeNull();

    rerender(<ThumbnailPicker options={OPTIONS} showLabels />);
    expect(screen.getByText('One Character', { ignore: '[aria-hidden]' })).toBeInTheDocument();
  });

  it('renders decorative thumbnails, since the radio carries the name', () => {
    render(<ThumbnailPicker options={OPTIONS} />);

    const images = screen.getAllByRole('presentation', { hidden: true });
    const thumbs = images.filter((img) => img.tagName === 'IMG') as HTMLImageElement[];

    expect(thumbs).toHaveLength(3);
    expect(thumbs[0]).toHaveAttribute('alt', '');
    expect(thumbs[0].getAttribute('src')).toBe('/one.gif');
    expect(thumbs[0]).toHaveAttribute('loading', 'lazy');
  });

  it('disables every option when the group is disabled', () => {
    const onChange = vi.fn();
    render(<ThumbnailPicker options={OPTIONS} disabled onChange={onChange} />);

    for (const { label } of OPTIONS) {
      expect(option(label)).toBeDisabled();
    }

    fireEvent.click(option('Name'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disables a single option', () => {
    render(
      <ThumbnailPicker
        options={[...OPTIONS.slice(0, 2), { ...OPTIONS[2], disabled: true }]}
      />,
    );

    expect(option('Name')).toBeEnabled();
    expect(option('Monogram')).toBeDisabled();
  });

  it('marks the selected tile for styling', () => {
    const { container } = render(<ThumbnailPicker options={OPTIONS} defaultValue="name" />);

    const selected = container.querySelectorAll('[data-selected]');
    expect(selected).toHaveLength(1);
    expect(selected[0]).toHaveAttribute('data-value', 'name');
  });

  it('works as a step in a flow', () => {
    function Flow() {
      const [style, setStyle] = useState<string | null>(null);
      return (
        <>
          <ThumbnailPicker
            options={OPTIONS}
            value={style}
            onChange={setStyle}
            heading="Step 1: Choose your style"
          />
          <p>Chosen: {style ?? 'nothing yet'}</p>
        </>
      );
    }

    render(<Flow />);
    expect(screen.getByText('Chosen: nothing yet')).toBeInTheDocument();

    fireEvent.click(option('Monogram'));
    expect(screen.getByText('Chosen: monogram')).toBeInTheDocument();
  });
});
