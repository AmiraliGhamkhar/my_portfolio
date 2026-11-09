import type { ReactNode } from 'react';
import type { Locale } from '../content';

interface Props {
  locale: Locale;
  number: string;
  eyebrow: string;
  title: string;
  aside?: ReactNode;
}

export function SectionHeading({ locale, number, eyebrow, title, aside }: Props) {
  return (
    <div className="section-heading" data-reveal>
      <div className="section-heading__index">
        <span className="index-dot" aria-hidden="true" />
        <span>{number}</span>
        <span className="section-heading__rule" />
        <span className="section-heading__eyebrow">{eyebrow}</span>
      </div>
      <div className="section-heading__row">
        <h2 className={`section-heading__title ${locale === 'fa' ? 'type-fa' : ''}`}>{title}</h2>
        {aside ? <div className="section-heading__aside">{aside}</div> : null}
      </div>
    </div>
  );
}
