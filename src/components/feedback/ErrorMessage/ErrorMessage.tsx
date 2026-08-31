import type { HTMLAttributes } from 'react';

import { Details, ErrorRoot } from './ErrorMessage.styles';

export interface ErrorMessageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The headline problem. */
  message: string;
  /** Field-level or secondary problems, listed under the message. */
  details?: string[];
}

/**
 * An inline error panel.
 *
 * `role="alert"` so it's announced when it appears — the source was a plain div,
 * which meant a screen-reader user got no indication that a form submission had
 * failed.
 *
 * The source took a nested API-error object (`{ message, code?, errors?: [{
 * message }] }`) whose `code` was never used and whose `errors` were awkward to
 * build by hand. Callers map their error shape to `message`/`details` instead.
 */
export function ErrorMessage({ message, details, ...rest }: ErrorMessageProps) {
  return (
    <ErrorRoot {...rest} role="alert">
      <span>{message}</span>

      {details && details.length > 0 ? (
        <Details>
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </Details>
      ) : null}
    </ErrorRoot>
  );
}

ErrorMessage.displayName = 'ErrorMessage';

export default ErrorMessage;
