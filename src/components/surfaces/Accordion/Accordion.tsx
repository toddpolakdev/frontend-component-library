import { useId, useState, type HTMLAttributes, type ReactNode } from 'react';

import { Icon, type IconVariant } from '../../data-display';
import {
  AccordionRoot,
  Header,
  IconSlot,
  Panel,
  PanelContent,
  PanelInner,
  Title,
} from './Accordion.styles';

export interface AccordionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** The always-visible summary in the header. */
  title: ReactNode;
  /** The collapsible content. */
  children: ReactNode;
  /** Starting state when the component manages its own open/closed. */
  defaultOpen?: boolean;
  /** Supply this to control the state yourself — e.g. one-open-at-a-time groups. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Icon shown while collapsed. Defaults to Plus, or ChevronRight when rotating. */
  iconClosed?: IconVariant;
  /** Icon shown while expanded. Ignored when `rotateIcon` is set. */
  iconOpened?: IconVariant;
  /**
   * Turn the icon 90° on expand instead of swapping it for `iconOpened` — the
   * chevron-style disclosure.
   */
  rotateIcon?: boolean;
  /** Which side of the title the icon sits on. */
  iconPosition?: 'start' | 'end';
  disabled?: boolean;
  id?: string;
}

/**
 * A single expandable section, usable with the keyboard.
 *
 * Trimmed hard from the source, which bundled three unrelated behaviours behind
 * prop flags: `breakpoint` returned `children` raw and skipped the accordion
 * entirely, `textCollapse` rendered a list of a different component instead, and
 * an `onClick` on the outer container called `window.open` with a CMS `pdf` URL —
 * so any click, including one on the toggle, also opened a new tab. Those belong
 * to the host app. What's left is the disclosure itself.
 *
 * This also covers the source's separate `Collapse` component, which was the same
 * disclosure with a rotating chevron ahead of the title — `rotateIcon` plus
 * `iconPosition="start"` gives that look without a second implementation to keep
 * accessible.
 */
export function Accordion({
  title,
  children,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  iconClosed,
  iconOpened = 'Minus',
  rotateIcon = false,
  iconPosition = 'end',
  disabled = false,
  id,
  ...rest
}: AccordionProps) {
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const headerId = `${baseId}-header`;
  const panelId = `${baseId}-panel`;

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const toggle = () => {
    const next = !open;
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  };

  // A rotated Plus would be indistinguishable from an un-rotated one, so the
  // rotating style needs a directional glyph by default.
  const closedIcon = iconClosed ?? (rotateIcon ? 'ChevronRight' : 'Plus');

  const icon = (
    <IconSlot $rotated={rotateIcon && open}>
      <Icon variant={rotateIcon || !open ? closedIcon : iconOpened} size={20} />
    </IconSlot>
  );

  return (
    <AccordionRoot {...rest} data-open={open || undefined}>
      <Header
        type="button"
        id={headerId}
        aria-expanded={open}
        aria-controls={panelId}
        disabled={disabled}
        onClick={toggle}
        $iconPosition={iconPosition}
      >
        {iconPosition === 'start' ? icon : null}
        <Title>{title}</Title>
        {iconPosition === 'end' ? icon : null}
      </Header>

      {/* The region and the visibility must sit on the same element: hiding a
          child would leave the region itself exposed to screen readers. */}
      <Panel $open={open}>
        <PanelInner
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          style={{ visibility: open ? 'visible' : 'hidden' }}
        >
          <PanelContent>{children}</PanelContent>
        </PanelInner>
      </Panel>
    </AccordionRoot>
  );
}

Accordion.displayName = 'Accordion';

export default Accordion;
