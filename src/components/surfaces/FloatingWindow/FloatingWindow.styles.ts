import styled from 'styled-components';

export const WindowRoot = styled.div`
  position: fixed;
  width: 440px;
  max-width: 92vw;
  max-height: 82vh;
  background: var(--app-surface);
  backdrop-filter: blur(12px);
  border: 1px solid var(--app-border);
  border-radius: 12px;
  box-shadow: var(--app-shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--app-text);
`;

export const Header = styled.div`
  background: var(--app-primary);
  color: #fff;
  padding: 0.7rem 1rem;
  font-weight: 600;
  cursor: grab;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`;

export const Controls = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const ControlButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1rem;
  line-height: 1;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const Body = styled.div`
  padding: 1rem;
  overflow: auto;
`;
