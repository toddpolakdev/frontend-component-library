import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ElementType,
  type ReactNode,
} from 'react';

import {
  Content,
  IconWrapper,
  SpinnerOverlay,
  SpinnerSvg,
  StyledButton,
  VisuallyHidden,
  type PrimaryButtonSize,
  type PrimaryButtonThemeMode,
  type PrimaryButtonVariant,
} from './PrimaryButton.styles';

export type { PrimaryButtonSize, PrimaryButtonThemeMode, PrimaryButtonVariant };

export interface PrimaryButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    // The link attributes that go with `as="a"`. Picking these beats full
    // polymorphic generics for the one element anyone actually swaps in.
    Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel' | 'download'> {
  children: ReactNode;
  ariaLabel?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  loadingLabel?: string;
  fullWidthOnMobile?: boolean;
  themeMode?: PrimaryButtonThemeMode;
  variant?: PrimaryButtonVariant;
  /** `slim` is shorter and not upper-cased, for toolbars and dense cards. */
  size?: PrimaryButtonSize;
  /**
   * Marks a toggle button as currently on, via `aria-pressed`. Leave undefined
   * for ordinary buttons — an always-present `aria-pressed` tells assistive tech
   * this is a toggle when it isn't.
   */
  active?: boolean;
  /**
   * Render as another element — `a` for a link styled as a button. `type` and
   * `disabled` are only emitted for real buttons, since neither is valid on an
   * anchor.
   */
  as?: ElementType;
}

const Spinner = () => (
  <SpinnerSvg aria-hidden="true" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      style={{ opacity: 0.25 }}
    />
    <path
      d="M22 12a10 10 0 0 0-10-10"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="4"
      style={{ opacity: 0.9 }}
    />
  </SpinnerSvg>
);

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  (
    {
      ariaLabel,
      children,
      className,
      disabled = false,
      fullWidthOnMobile = true,
      icon,
      iconPosition = 'left',
      isLoading = false,
      loadingLabel = 'Loading',
      themeMode = 'system',
      variant = 'primary',
      size = 'default',
      active,
      as,
      type = 'button',
      ...buttonProps
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;
    const isButtonElement = as === undefined || as === 'button';

    return (
      <StyledButton
        {...buttonProps}
        ref={ref}
        as={as}
        className={className}
        aria-busy={isLoading || undefined}
        aria-disabled={isDisabled || undefined}
        aria-label={ariaLabel}
        aria-pressed={active}
        data-theme-mode={themeMode}
        data-variant={variant}
        data-size={size}
        data-full-width={fullWidthOnMobile || undefined}
        // Neither attribute is valid on an anchor, so only a real button gets them.
        disabled={isButtonElement ? isDisabled : undefined}
        type={isButtonElement ? type : undefined}
        $themeMode={themeMode}
        $variant={variant}
        $size={size}
        $fullWidthOnMobile={fullWidthOnMobile}
      >
        {isLoading ? (
          <SpinnerOverlay>
            <Spinner />
            <VisuallyHidden aria-live="polite">{loadingLabel}</VisuallyHidden>
          </SpinnerOverlay>
        ) : null}

        <Content $loading={isLoading}>
          {icon && iconPosition === 'left' ? (
            <IconWrapper aria-hidden="true">{icon}</IconWrapper>
          ) : null}
          <span>{children}</span>
          {icon && iconPosition === 'right' ? (
            <IconWrapper aria-hidden="true">{icon}</IconWrapper>
          ) : null}
        </Content>
      </StyledButton>
    );
  },
);

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
