import { labels, type Locale } from '../content';
import { useSiteContent } from '../lib/SiteContent';
import { SectionHeading } from '../components/SectionHeading';

export function Experience({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  const t = labels[locale];
  const entries = [
    ...data.experience.map((entry) => ({ ...entry, organization: entry.organization, kind: experienceKind(locale) })),
    ...data.education.map((entry) => ({ ...entry, organization: entry.institution, kind: t.about.educationLabel })),
  ];
  const hasDates = entries.some((entry) => entry.start_date || entry.end_date);

  return (
    <section className="section rule-top" id="experience">
      <SectionHeading locale={locale} {...t.section.experience} />
      {entries.length ? (
        <div className="timeline">
          {entries.map((entry, index) => (
            <article className="timeline-item" key={`${entry.kind}-${entry.id ?? index}`} data-reveal>
              <div className="timeline-item__meta">
                {hasDates ? <span className="timeline-item__dates" dir="ltr">{dateRange(entry.start_date, entry.end_date)}</span> : null}
                <span className="timeline-item__kind">{entry.kind}</span>
              </div>
              <div>
                <h3>{entry.title}</h3>
                {entry.organization ? (
                  <p className="timeline-item__org">
                    {entry.organization}{entry.location ? ` / ${entry.location}` : ''}
                  </p>
                ) : null}
                {entry.description ? <p>{entry.description}</p> : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-panel" data-reveal>
          <h3>{t.experience.emptyTitle}</h3>
          <p>{t.experience.emptyText}</p>
        </div>
      )}
    </section>
  );
}

function experienceKind(locale: Locale): string {
  return locale === 'fa' ? 'تجربه' : 'Experience';
}

function dateRange(start: string, end: string): string {
  if (start && end) return `${start} — ${end}`;
  return start || end;
}
