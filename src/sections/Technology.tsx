import { labels, type Locale } from '../content';
import { useSiteContent } from '../lib/SiteContent';
import { SectionHeading } from '../components/SectionHeading';

export function Technology({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  const t = labels[locale];

  return (
    <section className="section rule-top" id="technologies">
      <div className="technology-layout">
        <div>
          <SectionHeading locale={locale} {...t.section.stack} />
          <p className="technology-note">{t.stack.note}</p>
        </div>
        {data.technologies.length ? (
          <div className="technology-list" data-reveal>
            {data.technologies.map((group) => (
              <div className="technology-row" key={group.group}>
                <h3>{locale === 'fa' ? group.faGroup || group.group : group.group}</h3>
                <div className="technology-row__items">
                  {group.items.map((item) => <span key={item} dir="ltr">{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="section-empty" data-reveal>{locale === 'fa' ? 'فهرست فناوری‌ها هنوز منتشر نشده است.' : 'No technologies have been published yet.'}</p>
        )}
      </div>
    </section>
  );
}
