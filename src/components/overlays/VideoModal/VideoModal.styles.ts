import styled from 'styled-components';

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const VideoWrapper = styled.div`
  position: relative;
  width: 90%;
  max-width: 960px;
  aspect-ratio: 16 / 9;
  background: black;
`;

export const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: -3rem;
  right: 0;
  background: none;
  border: none;
  color: #fff;
  font-size: 2.5rem;
  line-height: 1;
  cursor: pointer;

  &:hover {
    color: #ccc;
  }
`;
