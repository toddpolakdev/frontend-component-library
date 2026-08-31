import styled from 'styled-components';

export const Title = styled.h2`
  margin: 0;
  color: var(--app-text);
  font-size: 1.15rem;
  font-weight: 800;
`;

export const Message = styled.p`
  margin: 0.65rem 0 0;
  color: var(--app-muted);
  font-size: 0.95rem;
  line-height: 1.5;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1.5rem;
`;
