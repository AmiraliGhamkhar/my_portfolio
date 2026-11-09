import type { Locale } from '../content';
import { useSiteContent } from '../lib/SiteContent';
import { SectionHeading } from '../components/SectionHeading';

export function Achievements({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  if (!data.achievements.length) return null;

  return (
    <section className="section rule-top" id="achievements">
      <SectionHeading
        locale={locale}
        eyebrow={locale === 'fa' ? 'موارد تأییدشده' : 'Verified milestones'}
        title={locale === 'fa' ? 'دستاوردها' : 'Achievements'}
      />
      <div className="achievement-list" data-reveal>
        {data.achievements.map((item) => (
          <article className="achievement-item" key={item.id}>
            <div>
              <h3>{item.title}</h3>
              {item.issuer ? <small>{item.issuer}</small> : null}
              {item.description ? <p>{item.description}</p> : null}
            </div>
            {item.awarded_at ? <span className="achievement-item__date" dir="ltr">{item.awarded_at}</span> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
