import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import {
  Content,
  IconWrapper,
  SpinnerOverlay,
  SpinnerSvg,
  StyledButton,
  VisuallyHidden,
  type PrimaryButtonThemeMode,
  type PrimaryButtonVariant,
} from './PrimaryButton.styles';

export interface PrimaryButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  ariaLabel?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  loadingLabel?: string;
  fullWidthOnMobile?: boolean;
  themeMode?: PrimaryButtonThemeMode;
  variant?: PrimaryButtonVariant;
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
      type = 'button',
      ...buttonProps
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <StyledButton
        {...buttonProps}
        ref={ref}
        className={className}
        aria-busy={isLoading || undefined}
        aria-disabled={isDisabled || undefined}
        aria-label={ariaLabel}
        data-theme-mode={themeMode}
        data-variant={variant}
        data-full-width={fullWidthOnMobile || undefined}
        disabled={isDisabled}
        type={type}
        $themeMode={themeMode}
        $variant={variant}
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
