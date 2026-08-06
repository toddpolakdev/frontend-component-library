import styled, { keyframes } from 'styled-components';

const slide = keyframes`
  0% {
    transform: translateX(-110%);
  }
  100% {
    transform: translateX(260%);
  }
`;

const lift = keyframes`
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.65;
  }
  50% {
    transform: translateY(-0.18em);
    opacity: 1;
  }
`;

export const Overlay = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background:
    radial-gradient(
      circle at 30% 20%,
      color-mix(in srgb, var(--app-primary) 22%, transparent),
      transparent 22rem
    ),
    radial-gradient(
      circle at 75% 35%,
      color-mix(in srgb, var(--app-danger) 12%, transparent),
      transparent 24rem
    ),
    var(--app-bg);
  color: var(--app-text);
`;

export const LoaderCard = styled.div`
  width: min(22rem, calc(100vw - 2rem));
  padding: 2rem;
  border: 1px solid var(--app-border);
  border-radius: 1.5rem;
  background: color-mix(in srgb, var(--app-surface) 88%, transparent);
  box-shadow: var(--app-shadow);
  text-align: center;
`;

export const Mark = styled.div`
  display: inline-flex;
  gap: 0.35rem;
  margin-bottom: 1.25rem;
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  font-weight: 950;
  letter-spacing: -0.12em;
  line-height: 1;

  span {
    display: inline-block;
    animation: ${lift} 900ms ease-in-out infinite;
  }

  span:nth-child(2) {
    animation-delay: 120ms;
  }

  span:nth-child(3) {
    animation-delay: 240ms;
  }

  @media (prefers-reduced-motion: reduce) {
    span {
      animation: none;
    }
  }
`;

export const Track = styled.div`
  position: relative;
  height: 0.3rem;
  overflow: hidden;
  border-radius: 999px;
  background: var(--app-surface-muted);
`;

export const Progress = styled.span`
  position: absolute;
  inset: 0 auto 0 0;
  width: 42%;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    var(--app-primary),
    color-mix(in srgb, var(--app-primary) 45%, #ffffff)
  );
  animation: ${slide} 950ms cubic-bezier(0.65, 0, 0.35, 1) infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: none;
    width: 100%;
  }
`;

export const LoadingLabel = styled.p`
  margin: 1rem 0 0;
  color: var(--app-muted);
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;
