import { LoaderCard, LoadingLabel, Mark, Overlay, Progress, Track } from './PageLoader.styles';

export interface PageLoaderProps {
  /** Short brand mark rendered with an animated per-letter lift. */
  mark?: string;
  /** Status text announced to assistive tech. */
  label?: string;
}

export function PageLoader({ mark = 'CRM', label = 'Loading workspace' }: PageLoaderProps) {
  return (
    <Overlay role="status" aria-live="polite">
      <LoaderCard>
        <Mark aria-hidden="true">
          {Array.from(mark).map((character, index) => (
            <span key={`${character}-${index}`}>{character}</span>
          ))}
        </Mark>

        <Track>
          <Progress />
        </Track>

        <LoadingLabel>{label}</LoadingLabel>
      </LoaderCard>
    </Overlay>
  );
}

PageLoader.displayName = 'PageLoader';

export default PageLoader;
