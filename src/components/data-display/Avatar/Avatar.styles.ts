import styled from 'styled-components';

export const AvatarRoot = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  box-shadow: 0 8px 18px rgba(23, 32, 51, 0.18);
  background: ${(props) => props.$color};
`;
