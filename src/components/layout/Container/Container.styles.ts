import styled, { css } from 'styled-components';

/**
 * The centring wrapper `Text` deliberately gave up.
 *
 * `Text`'s body variant carried `max-width: 72rem; margin-inline: auto` in the
 * source — page layout welded into a typography primitive. This is where that
 * belongs, as something a caller opts into.
 */
export const ContainerRoot = styled.div<{ $fullWidth: boolean; $maxWidth: string }>`
  width: 100%;

  ${({ $fullWidth, $maxWidth }) =>
    !$fullWidth &&
    css`
      max-width: ${$maxWidth};
      margin-inline: auto;
      padding-inline: 1.5rem;
    `}
`;
