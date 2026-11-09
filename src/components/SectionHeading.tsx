import type { ReactNode } from 'react';
import type { Locale } from '../content';

interface Props {
  locale: Locale;
  eyebrow: string;
  title: string;
  aside?: ReactNode;
}

export function SectionHeading({ locale, eyebrow, title, aside }: Props) {
  return (
    <div className="section-heading" data-reveal>
      <p className="section-heading__eyebrow">{eyebrow}</p>
      <div className="section-heading__row">
        <h2 className={`section-heading__title ${locale === 'fa' ? 'lang-fa' : ''}`}>{title}</h2>
        {aside ? <div className="section-heading__aside">{aside}</div> : null}
      </div>
    </div>
  );
}
