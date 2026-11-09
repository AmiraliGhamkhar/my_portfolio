import { labels, type Locale } from '../content';
import { useSiteContent } from '../lib/SiteContent';
import { SectionHeading } from '../components/SectionHeading';

export function Capabilities({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  const t = labels[locale];
  const items = data.expertise;

  return (
    <section className="section section--alt rule-top" id="capabilities">
      <SectionHeading locale={locale} {...t.section.capabilities} />
      {items.length ? (
        <div className="capability-list">
          {items.map((item) => (
            <article className="capability" key={`${item.number}-${item.title}`} data-reveal>
              <span className="capability__index" aria-hidden="true">{item.number}</span>
              <div>
                <h3 className="capability__title">{item.title}</h3>
                {item.focus ? <p className="capability__focus">{item.focus}</p> : null}
              </div>
              <p className="capability__body">{item.description}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="section-empty" data-reveal>{locale === 'fa' ? 'حوزه‌ها پس از ویرایش از پنل مدیریت نمایش داده می‌شوند.' : 'Capabilities will appear here once added in the CMS.'}</p>
      )}
    </section>
  );
}
