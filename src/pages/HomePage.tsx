import { useState } from 'react';
import { ArrowDown, ArrowUpLeft, ArrowUpRight, BrainCircuit, Code2, HeartPulse, Sparkles, MoveUpRight, Copy, Check } from 'lucide-react';
import { Link } from 'react-router';
import { labels, type Locale } from '../content';
import { useSiteContent } from '../lib/SiteContent';
import { SectionHeading } from '../components/SectionHeading';
import { Portrait } from '../components/Portrait';
import { ProjectRail } from '../components/ProjectRail';
import { ContactForm } from '../components/ContactForm';

const expertiseIcons = { brain: BrainCircuit, heart: HeartPulse, code: Code2, sparkles: Sparkles } as const;

function Hero({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  const t = labels[locale].hero;
  return (
    <section className={`hero hero--${locale}`} aria-labelledby="hero-title">
      <div className="hero__inner">
        <div className="hero__eyebrow" data-reveal>
          <span className="hero__availability"><i />{locale === 'fa' ? 'در حال ساختن چیزهای معنادار' : 'BUILDING THINGS THAT MATTER'}</span>
          <span className="hero__edition">AG / 001—026</span>
        </div>
        <div className="hero__layout">
          <div className="hero__copy">
            <p className="hero__greeting" data-reveal>{data.profile.greeting || t.greeting}</p>
            <h1 className="hero__title type-fa" id="hero-title" data-reveal>{data.profile.statement}</h1>
            <p className="hero__role" data-reveal>{data.profile.role || t.role}</p>
            <div className="hero__actions" data-reveal>
              <a className="button button--accent" href={`/${locale}/#projects`}>
                <span>{t.ctaProjects}</span>{locale === 'fa' ? <ArrowUpLeft size={18} /> : <ArrowUpRight size={18} />}
              </a>
              <a className="button button--text" href={`/${locale}/#contact`}><span>{t.ctaContact}</span><span className="button__line" /></a>
            </div>
          </div>
          <div className="hero__visual" data-reveal>
            <div className="hero__orbit hero__orbit--a" />
            <div className="hero__orbit hero__orbit--b" />
            <div className="hero__glyph" aria-hidden="true"><span>A</span><i>G</i><b>.</b></div>
            <div className="hero__visual-label"><span>AI / HUMAN / SYSTEM</span><span>01—03</span></div>
            <div className="hero__visual-stamp" aria-hidden="true">IDEAS<br />INTO<br /><em>FORM</em></div>
          </div>
        </div>
        <div className="hero__bottom" data-reveal>
          <p>{t.index}</p>
          <a className="scroll-cue" href={`/${locale}/#about`}><span>{t.scroll}</span><ArrowDown size={15} aria-hidden="true" /></a>
          <span className="hero__coordinates">AI ENGINEERING&nbsp; · &nbsp;MEDICAL AI&nbsp; · &nbsp;SOFTWARE</span>
        </div>
      </div>
      <div className="hero__side-note" aria-hidden="true">AMIRALI GHAMKHAR — 2026</div>
    </section>
  );
}

function AboutSection({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  const t = labels[locale];
  return (
    <section className="section about-section" id="about">
      <SectionHeading locale={locale} {...t.section.about} />
      <div className="about-grid">
        <Portrait locale={locale} imageUrl={data.profile.portraitUrl} />
        <div className="about-copy" data-reveal>
          <p className="about-copy__lead">{t.about.lead}</p>
          <p className="about-copy__body">{data.profile.about || t.about.paragraph}</p>
          <div className="about-facts">
            <div className="about-fact"><span className="about-fact__index">A / 01</span><span><b>{t.about.educationLabel}</b><small>{data.education.length ? (locale === 'fa' ? 'اطلاعات تأییدشده در بخش مسیر ثبت شده است.' : 'Verified details are listed in the journey section.') : t.about.educationNote}</small></span></div>
            <div className="about-fact"><span className="about-fact__index">A / 02</span><span><b>{t.about.profileLabel}</b><small>{t.about.profileNote}</small></span></div>
          </div>
          <a className="text-link about-github" href={data.profile.githubUrl} target="_blank" rel="noreferrer" dir="ltr"><span>GitHub / AmiraliGhamkhar</span><MoveUpRight size={15} /></a>
        </div>
      </div>
    </section>
  );
}

function ExpertiseSection({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  const t = labels[locale];
  const items = data.expertise;
  return (
    <section className="section expertise-section" id="expertise">
      <SectionHeading locale={locale} {...t.section.expertise} />
      {items.length ? <div className="expertise-grid">
        {items.map((item) => {
          const Icon = expertiseIcons[item.icon];
          return (
            <article className="expertise-item" key={item.number + item.title} data-reveal>
              <div className="expertise-item__top"><span>{item.number}</span><Icon size={20} strokeWidth={1.45} aria-hidden="true" /></div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="expertise-item__foot">{t.expertise.more}</span>
            </article>
          );
        })}
      </div> : <p className="section-empty" data-reveal>{locale === 'fa' ? 'حوزه‌ها پس از ویرایش از پنل مدیریت نمایش داده می‌شوند.' : 'Focus areas will appear here once added in the CMS.'}</p>}
    </section>
  );
}

function TechnologySection({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  const t = labels[locale];
  return (
    <section className="technology-section" id="technologies">
      <div className="technology-section__lead" data-reveal>
        <div className="section-heading__index"><span className="index-dot" /><span>{t.section.stack.number}</span><span className="section-heading__rule" /><span className="section-heading__eyebrow">{t.section.stack.eyebrow}</span></div>
        <h2>{t.section.stack.title}</h2>
        <p>{t.stack.note}</p>
      </div>
      <div className="technology-list">
        {data.technologies.length ? data.technologies.map((group, index) => (
          <div className="technology-row" key={group.group} data-reveal>
            <span className="technology-row__index">0{index + 1}</span>
            <h3>{locale === 'fa' ? group.faGroup : group.group}</h3>
            <div className="technology-row__items">{group.items.map((item) => <span key={item} dir="ltr">{item}</span>)}</div>
          </div>
        )) : <p className="section-empty" data-reveal>{locale === 'fa' ? 'فهرست فناوری‌ها هنوز منتشر نشده است.' : 'No technologies have been published yet.'}</p>}
      </div>
    </section>
  );
}

function ExperienceSection({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  const t = labels[locale];
  const entries = [
    ...data.experience.map((entry) => ({ ...entry, entryType: t.nav.experience })),
    ...data.education.map((entry) => ({ ...entry, organization: entry.institution, entryType: t.about.educationLabel })),
  ];
  return (
    <section className="section experience-section" id="experience">
      <SectionHeading locale={locale} {...t.section.experience} />
      {entries.length ? (
        <div className="timeline">
          {entries.map((entry, index) => (
            <article className="timeline-item" key={`${entry.entryType}-${entry.id}`} data-reveal>
              <span className="timeline-item__index">{String(index + 1).padStart(2, '0')}</span>
              <span className="timeline-item__dates" dir="ltr">{entry.start_date}{entry.end_date ? ` — ${entry.end_date}` : ''}</span>
              <div><span className="timeline-item__kind">{entry.entryType}</span><h3>{entry.title}</h3><p className="timeline-item__org">{entry.organization}{entry.location ? ` / ${entry.location}` : ''}</p><p>{entry.description}</p></div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-timeline" data-reveal>
          <span className="empty-timeline__code">[ 00 / ENTRIES ]</span>
          <div><h3>{t.experience.emptyTitle}</h3><p>{t.experience.emptyText}</p></div>
          <span className="empty-timeline__mark" aria-hidden="true">—</span>
        </div>
      )}
    </section>
  );
}

function ResearchSection({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  const t = labels[locale];
  const entries = data.researchConfigured
    ? data.research.map((item) => ({ id: String(item.id), title: item.title, description: item.description || '' }))
    : data.interests.map((title, index) => ({ id: String(index), title, description: '' }));
  if (data.researchConfigured && entries.length === 0) return null;
  return (
    <section className="research-section" id="research">
      <div className="research-section__header" data-reveal>
        <div className="section-heading__index"><span className="index-dot" /><span>{t.section.research.number}</span><span className="section-heading__rule" /><span className="section-heading__eyebrow">{t.section.research.eyebrow}</span></div>
        <h2>{t.section.research.title}</h2>
        <p>{t.research.note}</p>
      </div>
      <ol className="interest-list">
        {entries.map((entry, index) => <li key={entry.id} data-reveal><span>{String(index + 1).padStart(2, '0')}</span><div><b>{entry.title}</b>{entry.description ? <small>{entry.description}</small> : null}</div><ArrowUpRight size={16} aria-hidden="true" /></li>)}
      </ol>
    </section>
  );
}

function PublicationsSection({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  if (!data.publications.length) return null;
  return (
    <section className="section publications-section" id="publications">
      <div className="section-heading" data-reveal>
        <div className="section-heading__index"><span className="index-dot" /><span>08</span><span className="section-heading__rule" /><span className="section-heading__eyebrow">{locale === 'fa' ? 'انتشارات تأییدشده' : 'Verified publications'}</span></div>
        <div className="section-heading__row"><h2 className="section-heading__title">{locale === 'fa' ? 'پژوهش، با ارجاع روشن.' : 'Research, clearly referenced.'}</h2></div>
      </div>
      <ol className="publication-list">{data.publications.map((item, index) => <li key={item.id} data-reveal><span className="publication-list__index">{String(index + 1).padStart(2, '0')}</span><div><h3>{item.title}</h3>{item.venue ? <p>{item.venue}{item.published_at ? ` / ${item.published_at}` : ''}</p> : null}{item.authors ? <small>{item.authors}</small> : null}{item.abstract ? <p className="publication-list__abstract">{item.abstract}</p> : null}</div>{item.url ? <a href={item.url} target="_blank" rel="noreferrer" aria-label={locale === 'fa' ? 'مشاهدهٔ انتشار' : 'View publication'}><MoveUpRight size={17} /></a> : null}</li>)}</ol>
    </section>
  );
}

function AchievementsSection({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  if (!data.achievements.length) return null;
  return (
    <section className="section achievements-section" id="achievements">
      <div className="section-heading" data-reveal><div className="section-heading__index"><span className="index-dot" /><span>09</span><span className="section-heading__rule" /><span className="section-heading__eyebrow">{locale === 'fa' ? 'موارد تأییدشده' : 'Verified milestones'}</span></div><div className="section-heading__row"><h2 className="section-heading__title">{locale === 'fa' ? 'دستاوردها' : 'Achievements'}</h2></div></div>
      <div className="achievement-list">{data.achievements.map((item, index) => <article className="achievement-item" key={item.id} data-reveal><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{item.title}</h3>{item.issuer ? <small>{item.issuer}</small> : null}<p>{item.description}</p></div><span className="achievement-item__date">{String(item.awarded_at || '')}</span></article>)}</div>
    </section>
  );
}

function ContactSection({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  const t = labels[locale];
  const socialLinks = data.socialLinks.length ? data.socialLinks : [
    { id: 0, label: 'GitHub', platform: 'GitHub', url: data.profile.githubUrl },
    { id: -1, label: 'LinkedIn', platform: 'LinkedIn', url: data.profile.linkedinUrl },
  ].filter((link) => Boolean(link.url));
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    if (!data.profile.email) return;
    try {
      await navigator.clipboard.writeText(data.profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch { /* Clipboard access is optional; the email link remains available. */ }
  };
  return (
    <section className="contact-section" id="contact">
      <div className="contact-section__intro" data-reveal>
        <div className="section-heading__index"><span className="index-dot" /><span>{t.section.contact.number}</span><span className="section-heading__rule" /><span className="section-heading__eyebrow">{t.section.contact.eyebrow}</span></div>
        <h2>{t.section.contact.title}</h2>
        <p>{t.contact.body}</p>
        <div className="contact-links">
          {data.profile.email ? <div className="contact-link-row"><span>{t.contact.email}</span><div><a href={`mailto:${data.profile.email}`} dir="ltr">{data.profile.email}</a><button type="button" onClick={copyEmail} aria-label={t.contact.copyEmail}>{copied ? <Check size={15} /> : <Copy size={15} />}</button><small className="copy-message" aria-live="polite">{copied ? t.contact.copied : ''}</small></div></div> : null}
          {socialLinks.map((link) => <div className="contact-link-row" key={link.id}><span>{link.label || link.platform}</span><a href={link.url} target="_blank" rel="noreferrer" dir="ltr">{link.url.replace(/^https?:\/\/(www\.)?/, '')} <MoveUpRight size={14} /></a></div>)}
        </div>
      </div>
      <div className="contact-section__form" data-reveal><ContactForm locale={locale} /></div>
    </section>
  );
}

export function HomePage({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  const t = labels[locale];
  return (
    <div className={`page page--home lang-${locale}`} data-page-root>
      <Hero locale={locale} />
      <div className="ticker" aria-label={locale === 'fa' ? 'مهندسی هوش مصنوعی، پزشکی، نرم‌افزار' : 'AI engineering, medical AI, software'}>
        <div className="ticker__track" aria-hidden="true"><span>AI ENGINEERING <i>✳</i> MEDICAL AI <i>✳</i> SOFTWARE SYSTEMS <i>✳</i> SPEECH PROCESSING <i>✳</i> PRODUCT THINKING <i>✳</i></span><span>AI ENGINEERING <i>✳</i> MEDICAL AI <i>✳</i> SOFTWARE SYSTEMS <i>✳</i> SPEECH PROCESSING <i>✳</i> PRODUCT THINKING <i>✳</i></span></div>
      </div>
      <AboutSection locale={locale} />
      <ExpertiseSection locale={locale} />
      <TechnologySection locale={locale} />
      <section className="section projects-section" id="projects">
        <SectionHeading locale={locale} {...t.section.projects} aside={<Link className="text-link" to={`/${locale}/projects/`}>{t.projects.viewAll}<MoveUpRight size={15} /></Link>} />
        <ProjectRail locale={locale} projects={data.projects} />
      </section>
      <ExperienceSection locale={locale} />
      <ResearchSection locale={locale} />
      <PublicationsSection locale={locale} />
      <AchievementsSection locale={locale} />
      <ContactSection locale={locale} />
      <div className="home-bottom-mark" aria-hidden="true"><span>AG</span><i>—</i><span>END OF PAGE / 001</span></div>
    </div>
  );
}
