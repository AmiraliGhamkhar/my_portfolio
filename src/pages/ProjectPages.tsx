import { ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight, MoveUpRight } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { labels, type Locale, type Project } from '../content';
import { useSiteContent } from '../lib/SiteContent';
import { SectionHeading } from '../components/SectionHeading';
import { ProjectArtwork } from '../components/ProjectArtwork';
import { ContactForm } from '../components/ContactForm';

function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  const t = labels[locale];
  const content = project[locale];
  return (
    <article className="project-list-card" dir={locale === 'fa' ? 'rtl' : 'ltr'} data-reveal>
      <Link to={`/${locale}/projects/${project.slug}/`} className="project-list-card__visual" aria-label={`${t.projects.open}: ${content.title}`}>
        <ProjectArtwork project={project} locale={locale} compact />
      </Link>
      <div className="project-list-card__body">
        <div className="project-card__title-line">
          <div><span className="project-card__category">{content.category}</span><h2><Link to={`/${locale}/projects/${project.slug}/`}>{content.title}</Link></h2></div>
          <Link to={`/${locale}/projects/${project.slug}/`} className="project-open" aria-label={content.title}><MoveUpRight size={19} /></Link>
        </div>
        <p>{content.summary}</p>
        <div className="project-card__bottom"><div className="tag-list">{project.technologies.map((tech) => <span className="tag" key={tech} dir="ltr">{tech}</span>)}</div>{project.githubUrl ? <a className="text-link" href={project.githubUrl} target="_blank" rel="noreferrer">{t.projects.repository}<MoveUpRight size={14} /></a> : null}</div>
      </div>
    </article>
  );
}

export function ProjectsPage({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  const t = labels[locale];
  return (
    <div className={`page page--projects lang-${locale}`} data-page-root>
      <header className="page-intro" data-reveal>
        <p className="page-intro__eyebrow">AG / PROJECT INDEX — 0{data.projects.length}</p>
        <h1>{t.section.projects.title}</h1>
        <p className="page-intro__description">{locale === 'fa' ? 'نمونه‌هایی از مسیر ساخت ابزارهای هوشمند، سیستم‌های گفتاری و تجربه‌های نرم‌افزاری.' : 'Selected work exploring intelligent tools, speech systems, and considered software experiences.'}</p>
        <span className="page-intro__coordinate">FA / EN — 2026</span>
      </header>
      <div className="project-list-grid">
        {data.projects.map((project) => <ProjectCard key={project.slug} project={project} locale={locale} />)}
      </div>
      <div className="project-list-footer"><Link className="text-link" to={`/${locale}/#contact`}>{t.nav.contact}{locale === 'fa' ? <ArrowUpLeft size={16} /> : <ArrowUpRight size={16} />}</Link></div>
    </div>
  );
}

export function ProjectDetailPage({ locale }: { locale: Locale }) {
  const { slug } = useParams<{ slug: string }>();
  const { projects } = useSiteContent();
  const project = projects.find((item) => item.slug === slug);
  const t = labels[locale];

  if (!project) {
    return <NotFoundPage locale={locale} />;
  }
  const content = project[locale];
  return (
    <div className={`page page--project-detail lang-${locale}`} data-page-root>
      <div className="case-breadcrumb" data-reveal><Link to={`/${locale}/projects/`}>{t.project.back}</Link><span>/</span><span>{project.number} — {project.slug}</span></div>
      <header className="case-hero" data-reveal>
        <div className="case-hero__meta"><span className="index-dot" />{content.category}<span className="case-hero__id" dir="ltr">PROJECT / {project.number}</span></div>
        <h1>{content.title}</h1>
        <p>{content.summary}</p>
        <div className="tag-list">{project.technologies.map((tech) => <span className="tag" key={tech} dir="ltr">{tech}</span>)}</div>
      </header>
      <div className="case-art" data-reveal><ProjectArtwork project={project} locale={locale} /></div>
      {project.images?.length ? <div className="case-gallery" aria-label={locale === 'fa' ? 'گالری تصاویر پروژه' : 'Project image gallery'}>{project.images.map((image, index) => <figure key={image.id ?? image.url}><img src={image.url} alt={image.alt || `${content.title} / ${String(index + 1).padStart(2, '0')}`} loading="lazy" /><figcaption>{String(index + 1).padStart(2, '0')} / {project.images?.length}</figcaption></figure>)}</div> : null}
      <div className="case-content">
        <aside className="case-sidebar" data-reveal>
          <div className="case-sidebar__item"><span>{locale === 'fa' ? 'دسته' : 'Category'}</span><b>{content.category}</b></div>
          <div className="case-sidebar__item"><span>{t.project.stack}</span><div className="case-sidebar__tags">{project.technologies.map((tech) => <span dir="ltr" key={tech}>{tech}</span>)}</div></div>
          <div className="case-sidebar__item"><span>{locale === 'fa' ? 'پیوندها' : 'Links'}</span>{project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer">GitHub <MoveUpRight size={14} /></a> : <small>{t.project.noDemo}</small>}</div>
          {project.liveUrl ? <div className="case-sidebar__item"><span>{locale === 'fa' ? 'نسخهٔ زنده' : 'Live demo'}</span><a href={project.liveUrl} target="_blank" rel="noreferrer">{locale === 'fa' ? 'مشاهده' : 'Visit'} <MoveUpRight size={14} /></a></div> : null}
        </aside>
        <article className="case-story" data-reveal>
          <span className="case-story__eyebrow">{t.project.overview} / {project.number}</span>
          <h2>{locale === 'fa' ? 'یک ایده، در قالب یک سامانه.' : 'An idea, shaped into a system.'}</h2>
          <p className="case-story__lead">{content.description}</p>
          <h3>{t.project.details}</h3>
          <ul>{content.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
          {content.note ? <div className="case-note"><span>NOTE / SCOPE</span><p>{content.note}</p></div> : null}
          <a className="button button--accent case-repository" href={project.githubUrl} target="_blank" rel="noreferrer"><span>{t.project.repository}</span>{locale === 'fa' ? <ArrowUpLeft size={17} /> : <ArrowUpRight size={17} />}</a>
        </article>
      </div>
      <div className="case-end"><Link className="text-link" to={`/${locale}/projects/`}>{locale === 'fa' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}{t.project.back}</Link><Link className="text-link" to={`/${locale}/#contact`}>{t.nav.contact}{locale === 'fa' ? <ArrowUpLeft size={16} /> : <ArrowUpRight size={16} />}</Link></div>
    </div>
  );
}

export function ContactPage({ locale }: { locale: Locale }) {
  const t = labels[locale];
  return (
    <div className={`page page--contact lang-${locale}`} data-page-root>
      <div className="page-intro page-intro--contact" data-reveal>
        <p className="page-intro__eyebrow">AG / OPEN CHANNEL</p>
        <h1>{t.section.contact.title}</h1>
        <p className="page-intro__description">{t.contact.body}</p>
      </div>
      <div className="contact-page__form"><ContactForm locale={locale} /></div>
      <div className="contact-page__links"><Link className="text-link" to={`/${locale}/`}>{t.common.home}</Link></div>
    </div>
  );
}

export function NotFoundPage({ locale }: { locale: Locale }) {
  const t = labels[locale];
  return (
    <div className={`page page--not-found lang-${locale}`} data-page-root>
      <span className="not-found-code">404 / ROUTE NOT FOUND</span>
      <h1>{t.common.notFound}</h1>
      <Link className="button button--accent" to={`/${locale}/`}>{t.common.backHome}{locale === 'fa' ? <ArrowUpLeft size={17} /> : <ArrowUpRight size={17} />}</Link>
    </div>
  );
}
