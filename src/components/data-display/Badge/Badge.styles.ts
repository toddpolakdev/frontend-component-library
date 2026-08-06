import styled, { css } from 'styled-components';

export type BadgeVariant = 'client' | 'lead' | 'vendor' | 'partner' | 'admin' | 'user';

const variantStyles: Record<BadgeVariant, ReturnType<typeof css>> = {
  client: css`
    background: #dbeafe;
    color: #1d4ed8;
  `,
  lead: css`
    background: #fef3c7;
    color: #b45309;
  `,
  vendor: css`
    background: #dcfce7;
    color: #15803d;
  `,
  partner: css`
    background: #f3e8ff;
    color: #7e22ce;
  `,
  admin: css`
    background: #fee2e2;
    color: #b91c1c;
  `,
  user: css`
    background: #e0f2fe;
    color: #0369a1;
  `,
};

export const BadgeRoot = styled.span<{ $variant: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 800;
  ${(props) => variantStyles[props.$variant]}
`;
