import { MoveUpRight } from 'lucide-react';
import { labels, type Locale } from '../content';
import { useSiteContent } from '../lib/SiteContent';
import { SectionHeading } from '../components/SectionHeading';
import { Portrait } from '../components/Portrait';

export function About({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  const t = labels[locale];
  const educationPublished = data.education.length > 0;

  return (
    <section className="section rule-top" id="about">
      <SectionHeading locale={locale} {...t.section.about} />
      <div className="about-grid">
        <Portrait locale={locale} imageUrl={data.profile.portraitUrl} />
        <div className="about-copy" data-reveal>
          <p className="about-copy__greeting">{data.profile.greeting}</p>
          <p className="about-copy__lead">{t.about.lead}</p>
          <p className="about-copy__body">{data.profile.about}</p>
          <div className="about-now">
            <span className="about-now__label">{t.about.nowLabel}</span>
            <p>{t.about.now}</p>
          </div>
          <dl className="about-facts">
            <div className="about-fact">
              <dt>{t.about.educationLabel}</dt>
              <dd>{educationPublished ? (locale === 'fa' ? 'جزئیات تأییدشده در بخش مسیر ثبت شده است.' : 'Verified details are listed in the journey section.') : t.about.educationNote}</dd>
            </div>
            <div className="about-fact">
              <dt>{t.about.profileLabel}</dt>
              <dd>{t.about.profileNote}</dd>
            </div>
          </dl>
          {data.profile.githubUrl ? (
            <a className="text-link about-github" href={data.profile.githubUrl} target="_blank" rel="noreferrer" dir="ltr">
              <span>{t.about.githubLabel}</span>
              <MoveUpRight size={15} aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
