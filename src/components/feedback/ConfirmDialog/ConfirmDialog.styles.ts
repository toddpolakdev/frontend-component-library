import styled from 'styled-components';

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgb(15 23 42 / 60%);
  backdrop-filter: blur(4px);
`;

export const Dialog = styled.section`
  width: min(100%, 28rem);
  overflow: hidden;
  border: 1px solid var(--app-border);
  border-radius: 18px;
  background: var(--app-surface);
  box-shadow: var(--app-shadow);
`;

export const DialogContent = styled.div`
  padding: 1.5rem 1.5rem 1rem;
`;

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
  padding: 1rem 1.5rem 1.5rem;
`;
