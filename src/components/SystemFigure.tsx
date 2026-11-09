import type { Locale } from '../content';

interface Props {
  locale: Locale;
  caption: string;
  stages: string[];
  foot?: string;
  compact?: boolean;
}

/**
 * A pipeline view rendered from real text so it mirrors correctly in RTL,
 * stays selectable, and costs no image request.
 */
export function SystemFigure({ locale, caption, stages, foot, compact = false }: Props) {
  if (!stages.length) return null;
  return (
    <figure className={`system-figure ${compact ? 'system-figure--compact' : ''}`} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <figcaption className="system-figure__caption">{caption}</figcaption>
      <ol className="system-figure__flow">
        {stages.map((stage, index) => (
          <li className="system-figure__step" key={stage}>
            <span className="system-figure__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span className="system-figure__label">{stage}</span>
          </li>
        ))}
      </ol>
      {foot ? <p className="system-figure__foot">{foot}</p> : null}
    </figure>
  );
}
