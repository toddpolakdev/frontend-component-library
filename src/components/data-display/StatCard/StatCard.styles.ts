import styled, { css } from 'styled-components';

export type StatCardVariant = 'blue' | 'purple' | 'pink' | 'green';

const variantGradients: Record<StatCardVariant, ReturnType<typeof css>> = {
  blue: css`
    background: linear-gradient(135deg, #2454c6, #38bdf8);
  `,
  purple: css`
    background: linear-gradient(135deg, #7e22ce, #c084fc);
  `,
  pink: css`
    background: linear-gradient(135deg, #db2777, #fb7185);
  `,
  green: css`
    background: linear-gradient(135deg, #16a34a, #4ade80);
  `,
};

export const Card = styled.article<{ $variant: StatCardVariant }>`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex: 1 1 230px;
  padding: 22px;
  border-radius: 18px;
  color: #ffffff;
  box-shadow: 0 12px 28px rgba(23, 32, 51, 0.14);
  ${(props) => variantGradients[props.$variant]}
`;

export const IconBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.2);
  font-size: 1.35rem;
`;

export const Title = styled.p`
  margin: 0;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.9;
`;

export const Value = styled.p`
  margin: 8px 0 4px;
  font-size: 2rem;
  font-weight: 900;
  line-height: 1;
`;

export const Description = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  opacity: 0.9;
`;
