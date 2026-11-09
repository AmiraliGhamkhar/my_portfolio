import { ArrowDown, ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { heroFlow, labels, type Locale } from '../content';
import { useSiteContent } from '../lib/SiteContent';
import { SystemFigure } from '../components/SystemFigure';

export function Hero({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  const t = labels[locale].hero;
  const flow = heroFlow[locale];
  const flagship = data.projects.find((project) => project.featured) ?? data.projects[0];
  const Outbound = locale === 'fa' ? ArrowUpLeft : ArrowUpRight;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="hero__eyebrow" data-reveal>{t.eyebrow}</p>
          <h1 className="hero__title" id="hero-title" data-reveal>{data.profile.name}</h1>
          <p className="hero__statement" data-reveal>{data.profile.statement}</p>
          <p className="hero__body" data-reveal>{t.body}</p>
          <div className="hero__actions" data-reveal>
            <a className="button button--accent" href={`/${locale}/#work`}>
              <span>{t.ctaProjects}</span>
              <Outbound size={17} aria-hidden="true" />
            </a>
            <Link className="button button--quiet" to={`/${locale}/contact/`}>
              <span>{t.ctaContact}</span>
            </Link>
          </div>
          <a className="hero__scroll" href={`/${locale}/#work`}>
            <span>{t.scroll}</span>
            <ArrowDown size={14} aria-hidden="true" />
          </a>
        </div>
        <div className="hero__aside" data-reveal>
          {flagship ? (
            <Link className="figure-link" to={`/${locale}/projects/${flagship.slug}/`} aria-label={`${labels[locale].projects.open}: ${flagship[locale].title}`}>
              <SystemFigure
                locale={locale}
                caption={t.figureCaption}
                stages={flow}
                foot={t.figureFoot}
                compact
              />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
