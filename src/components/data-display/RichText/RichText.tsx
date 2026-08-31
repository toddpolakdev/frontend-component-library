import { useMemo, type ElementType, type HTMLAttributes } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

import { Prose } from './RichText.styles';

export interface RichTextProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'dangerouslySetInnerHTML'> {
  /** Markdown source. Renders nothing when empty. */
  body?: string | null;
  /**
   * Element to render into. Anything block-level; a `<p>` can't legally contain
   * the headings and lists markdown produces.
   */
  as?: ElementType;
}

/**
 * Renders markdown as styled prose.
 *
 * Output is sanitised before it reaches the DOM. `marked` deliberately does no
 * sanitising of its own — the `sanitize` option was removed in v5 and the docs
 * point at DOMPurify — so the source's `marked.parse()` straight into
 * `dangerouslySetInnerHTML` executed any raw HTML the markdown contained. That's
 * fine for hardcoded copy and an XSS hole for anything authored elsewhere, which
 * is precisely the content a rich-text component attracts.
 */
export function RichText({ body, as = 'div', ...rest }: RichTextProps) {
  const html = useMemo(() => {
    if (!body) {
      return '';
    }

    const parsed = marked.parse(body, { async: false }) as string;
    return DOMPurify.sanitize(parsed);
  }, [body]);

  if (!html) {
    return null;
  }

  return <Prose {...rest} as={as} dangerouslySetInnerHTML={{ __html: html }} />;
}

RichText.displayName = 'RichText';

export default RichText;
