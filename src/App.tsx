import PrimaryButton from './components/PrimaryButton';

const ArrowIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
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

export default function App() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <section className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Frontend Component Library</p>
          <h1 className="text-3xl font-bold sm:text-4xl">PrimaryButton playground</h1>
          <p className="max-w-2xl text-base text-slate-600">
            This minimal Vite app exists so you can run the component library locally and launch Storybook from the
            same repo.
          </p>
        </section>

        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
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
        </section>
      </div>
    </main>
  );
}
