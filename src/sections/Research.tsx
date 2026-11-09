import { labels, type Locale } from '../content';
import { useSiteContent } from '../lib/SiteContent';
import { SectionHeading } from '../components/SectionHeading';

export function Research({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  const t = labels[locale];
  const entries = data.researchConfigured
    ? data.research.map((item) => ({ id: String(item.id), title: item.title, description: item.description || '' }))
    : data.interests.map((title, index) => ({ id: String(index), title, description: '' }));

  if (data.researchConfigured && entries.length === 0) return null;

  return (
    <section className="section section--alt rule-top" id="research">
      <div className="research-layout">
        <div>
          <SectionHeading locale={locale} {...t.section.research} />
          <p className="research-note">{t.research.note}</p>
        </div>
        <ul className="interest-list" data-reveal>
          {entries.map((entry) => (
            <li key={entry.id}>
              <b>{entry.title}</b>
              {entry.description ? <small>{entry.description}</small> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
