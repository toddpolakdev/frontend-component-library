import styled from 'styled-components';

import { PrimaryButton, ThemeToggle } from './components';

const ArrowIcon = () => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const Page = styled.main`
  min-height: 100vh;
  padding: 3rem 1.5rem;
  background: var(--app-bg);
  color: var(--app-text);
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Container = styled.div`
  margin: 0 auto;
  display: flex;
  max-width: 64rem;
  flex-direction: column;
  gap: 2rem;
`;

const Intro = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Eyebrow = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #0284c7;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.875rem;
  font-weight: 700;

  @media (min-width: 640px) {
    font-size: 2.25rem;
  }
`;

const Lede = styled.p`
  margin: 0;
  max-width: 42rem;
  font-size: 1rem;
  color: var(--app-muted);
`;

const Showcase = styled.section`
  display: grid;
  gap: 1rem;
  border-radius: 1rem;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
  padding: 1.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

export default function App() {
  return (
    <Page>
      <Container>
        <Toolbar>
          <ThemeToggle />
        </Toolbar>

        <Intro>
          <Eyebrow>Frontend Component Library</Eyebrow>
          <Title>PrimaryButton playground</Title>
          <Lede>
            This minimal Vite app exists so you can run the component library locally and launch Storybook from the
            same repo.
          </Lede>
        </Intro>

        <Showcase>
          <PrimaryButton ariaLabel="Continue to next step">Default</PrimaryButton>
          <PrimaryButton ariaLabel="Get started now" icon={<ArrowIcon />}>
            With icon
          </PrimaryButton>
          <PrimaryButton ariaLabel="Saving your work" isLoading loadingLabel="Saving your work">
            Saving
          </PrimaryButton>
          <PrimaryButton ariaLabel="Unavailable action" disabled>
            Disabled
          </PrimaryButton>
        </Showcase>
      </Container>
    </Page>
  );
}
