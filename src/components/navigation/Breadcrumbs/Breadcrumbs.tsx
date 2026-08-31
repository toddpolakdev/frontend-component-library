import type { HTMLAttributes, ReactNode } from 'react';

import { Crumb, CrumbLink, Current, Nav, Separator, Trail } from './Breadcrumbs.styles';

export interface BreadcrumbItem {
  label: string;
  /** Omit on the current page — the last item is treated as current regardless. */
  href?: string;
}

export interface BreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items: BreadcrumbItem[];
  /** Accessible name for the nav landmark. */
  label?: string;
  /** Drawn between steps. Decorative, never announced. */
  separator?: ReactNode;
}

/**
 * A breadcrumb trail.
 *
 * Generalised from the source's `CategoryBreadcrumbs`, which hardcoded a
 * three-level commerce path — a "Shop"/"Home" root, then category, then product —
 * and built its hrefs by string concatenation from `baseUrl`, `category` and
 * `defaultCategory`. It also emitted a bare `<div>` of `<span>`s, so there was no
 * landmark and no list structure for a screen reader to work with, and it left a
 * dangling separator when neither a category nor a product was given.
 */
export function Breadcrumbs({
  items,
  label = 'Breadcrumb',
  separator = '/',
  ...rest
}: BreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Nav {...rest} aria-label={label}>
      <Trail>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Crumb key={`${item.label}-${index}`}>
              {item.href && !isLast ? (
                <CrumbLink href={item.href}>{item.label}</CrumbLink>
              ) : (
                <Current aria-current={isLast ? 'page' : undefined}>{item.label}</Current>
              )}

              {isLast ? null : <Separator aria-hidden="true">{separator}</Separator>}
            </Crumb>
          );
        })}
      </Trail>
    </Nav>
  );
}

Breadcrumbs.displayName = 'Breadcrumbs';

export default Breadcrumbs;
