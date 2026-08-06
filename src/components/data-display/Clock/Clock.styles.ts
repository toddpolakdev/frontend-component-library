import styled from 'styled-components';

export const ClockRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.15;
  min-width: 90px;
  color: var(--app-text);
`;

export const Time = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
`;

export const DateText = styled.span`
  font-size: 0.72rem;
  color: var(--app-muted);
`;
