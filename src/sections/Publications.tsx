import { MoveUpRight } from 'lucide-react';
import { labels, type Locale } from '../content';
import { useSiteContent } from '../lib/SiteContent';
import { SectionHeading } from '../components/SectionHeading';

export function Publications({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  if (!data.publications.length) return null;
  const t = labels[locale];

  return (
    <section className="section section--alt rule-top" id="publications">
      <SectionHeading
        locale={locale}
        eyebrow={locale === 'fa' ? 'انتشارات تأییدشده' : 'Verified publications'}
        title={locale === 'fa' ? 'پژوهش، با ارجاع روشن.' : 'Research, clearly referenced.'}
      />
      <ol className="publication-list" data-reveal>
        {data.publications.map((item) => (
          <li key={item.id}>
            <div>
              <h3>{item.title}</h3>
              {item.venue ? <small dir="ltr">{item.venue}{item.published_at ? ` / ${item.published_at}` : ''}</small> : null}
              {item.authors ? <p>{item.authors}</p> : null}
              {item.abstract ? <p className="publication-list__abstract">{item.abstract}</p> : null}
            </div>
            {item.url ? (
              <a href={item.url} target="_blank" rel="noreferrer" aria-label={t.projects.open}>
                <MoveUpRight size={17} aria-hidden="true" />
              </a>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
