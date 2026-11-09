import { ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight, MoveUpRight } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { labels, systemFlows, type Locale, type Project } from '../content';
import { useSiteContent } from '../lib/SiteContent';
import { SystemFigure } from '../components/SystemFigure';
import { ContactForm } from '../components/ContactForm';

function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  const t = labels[locale];
  const content = project[locale];
  const flow = systemFlows[project.slug]?.[locale];

  return (
    <article className="project-list-card" dir={locale === 'fa' ? 'rtl' : 'ltr'} data-reveal>
      <div className="project-list-card__body">
        <p className="project-entry__category">{content.category}</p>
        <h2><Link to={`/${locale}/projects/${project.slug}/`}>{content.title}</Link></h2>
        <p className="project-list-card__summary">{content.summary}</p>
        <p className="project-list-card__desc">{content.description}</p>
      </div>
      {flow ? <SystemFigure locale={locale} caption={flow.caption} stages={flow.stages.slice(0, 3)} compact /> : null}
      <div className="project-list-card__foot">
        <div className="tag-list">{project.technologies.map((tech) => <span className="tag" key={tech} dir="ltr">{tech}</span>)}</div>
        <div className="project-entry__links">
          {project.githubUrl ? (
            <a className="text-link" href={project.githubUrl} target="_blank" rel="noreferrer">
              <span>{t.projects.repository}</span>
              <MoveUpRight size={14} aria-hidden="true" />
            </a>
          ) : null}
          <Link className="text-link" to={`/${locale}/projects/${project.slug}/`}>
            <span>{t.projects.open}</span>
            <MoveUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
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
        <p className="page-intro__eyebrow">{t.section.work.eyebrow}</p>
        <h1 className={locale === 'fa' ? 'lang-fa' : ''}>{t.section.work.title}</h1>
        <p className="page-intro__description">
          {locale === 'fa'
            ? 'سامانه‌هایی که از مسئله تا اجرا ساخته‌ام: خط‌لوله‌های گفتار و سند، ابزارهای دیکتهٔ پزشکی و صفحه‌های محصول که روی هاست اشتراکی بالا می‌آیند.'
            : 'Systems I have taken from problem to production: speech and document pipelines, a medical dictation tool, and product pages that run on shared hosting.'}
        </p>
      </header>
      {data.projects.length ? (
        <div className="project-list-grid">
          {data.projects.map((project) => <ProjectCard key={project.slug} project={project} locale={locale} />)}
        </div>
      ) : (
        <div className="page-empty"><p className="section-empty">{t.projects.empty}</p></div>
      )}
      <div className="project-list-footer">
        <Link className="text-link" to={`/${locale}/contact/`}>
          <span>{t.nav.contact}</span>
          {locale === 'fa' ? <ArrowUpLeft size={16} aria-hidden="true" /> : <ArrowUpRight size={16} aria-hidden="true" />}
        </Link>
      </div>
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
  const flow = systemFlows[project.slug]?.[locale];
  const caseStudy = content.caseStudy;
  const Outbound = locale === 'fa' ? ArrowUpLeft : ArrowUpRight;

  return (
    <div className={`page page--project-detail lang-${locale}`} data-page-root>
      <div className="case-breadcrumb" data-reveal>
        <Link to={`/${locale}/projects/`}>{t.project.back}</Link>
        <span aria-hidden="true">/</span>
        <span>{content.title}</span>
      </div>
      <header className="case-hero" data-reveal>
        <p className="case-hero__category">{content.category}</p>
        <h1 className={locale === 'fa' ? 'lang-fa' : ''}>{content.title}</h1>
        <p>{content.summary}</p>
        <div className="tag-list">{project.technologies.map((tech) => <span className="tag" key={tech} dir="ltr">{tech}</span>)}</div>
      </header>

      <div className="case-content">
        <aside className="case-sidebar" data-reveal>
          {flow ? <SystemFigure locale={locale} caption={flow.caption} stages={flow.stages} foot={flow.foot} compact /> : null}
          <div className="case-sidebar__item">
            <span>{t.project.stack}</span>
            <div className="case-sidebar__tags">
              {project.technologies.map((tech) => <span key={tech} dir="ltr">{tech}</span>)}
            </div>
          </div>
          <div className="case-sidebar__item">
            <span>{locale === 'fa' ? 'پیوندها' : 'Links'}</span>
            {project.githubUrl ? (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" dir="ltr">
                <span>{t.project.repository}</span>
                <MoveUpRight size={14} aria-hidden="true" />
              </a>
            ) : <small>{t.project.noDemo}</small>}
          </div>
          {project.liveUrl ? (
            <div className="case-sidebar__item">
              <span>{t.projects.live}</span>
              <a href={project.liveUrl} target="_blank" rel="noreferrer" dir="ltr">
                <span>{locale === 'fa' ? 'مشاهده' : 'Visit'}</span>
                <MoveUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          ) : null}
        </aside>

        <article className="case-story" data-reveal>
          <p className="case-story__lead">{content.description}</p>
          {caseStudy.problem ? (
            <section className="case-story__section">
              <h2>{t.projects.problem}</h2>
              <p>{caseStudy.problem}</p>
            </section>
          ) : null}
          {caseStudy.solution ? (
            <section className="case-story__section">
              <h2>{t.projects.solution}</h2>
              <p>{caseStudy.solution}</p>
            </section>
          ) : null}
          {caseStudy.engineering.length ? (
            <section className="case-story__section">
              <h2>{t.projects.engineering}</h2>
              <ul className="case-story__list">
                {caseStudy.engineering.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
            </section>
          ) : null}
          {caseStudy.outcome ? (
            <section className="case-story__section">
              <h2>{t.projects.outcome}</h2>
              <p>{caseStudy.outcome}</p>
            </section>
          ) : null}
          {content.details.length ? (
            <section className="case-story__section">
              <h2>{t.project.details}</h2>
              <ul className="case-story__list">
                {content.details.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
            </section>
          ) : null}
          {content.note ? (
            <div className="case-note">
              <span>{t.project.scope}</span>
              <p>{content.note}</p>
            </div>
          ) : null}
          {project.githubUrl ? (
            <a className="button button--accent" href={project.githubUrl} target="_blank" rel="noreferrer">
              <span>{t.project.repository}</span>
              <Outbound size={17} aria-hidden="true" />
            </a>
          ) : null}
        </article>
      </div>

      {project.images?.length ? (
        <div className="case-gallery" aria-label={locale === 'fa' ? 'گالری تصاویر پروژه' : 'Project image gallery'}>
          {project.images.map((image, index) => (
            <figure key={image.id ?? image.url}>
              <img src={image.url} alt={image.alt || `${content.title} — ${index + 1}`} loading="lazy" />
              <figcaption>{image.alt || String(index + 1).padStart(2, '0')}</figcaption>
            </figure>
          ))}
        </div>
      ) : null}

      <div className="case-end">
        <Link className="text-link" to={`/${locale}/projects/`}>
          {locale === 'fa' ? <ArrowRight size={16} aria-hidden="true" /> : <ArrowLeft size={16} aria-hidden="true" />}
          <span>{t.project.back}</span>
        </Link>
        <Link className="text-link" to={`/${locale}/contact/`}>
          <span>{t.nav.contact}</span>
          <Outbound size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export function ContactPage({ locale }: { locale: Locale }) {
  const t = labels[locale];
  return (
    <div className={`page page--contact lang-${locale}`} data-page-root>
      <div className="page-intro page-intro--contact" data-reveal>
        <p className="page-intro__eyebrow">{t.section.contact.eyebrow}</p>
        <h1 className={locale === 'fa' ? 'lang-fa' : ''}>{t.section.contact.title}</h1>
        <p className="page-intro__description">{t.contact.body}</p>
      </div>
      <div className="contact-page__form"><ContactForm locale={locale} /></div>
      <div className="contact-page__links">
        <Link className="text-link" to={`/${locale}/`}>
          {locale === 'fa' ? <ArrowRight size={16} aria-hidden="true" /> : <ArrowLeft size={16} aria-hidden="true" />}
          <span>{t.common.home}</span>
        </Link>
      </div>
    </div>
  );
}

export function NotFoundPage({ locale }: { locale: Locale }) {
  const t = labels[locale];
  return (
    <div className={`page page--not-found lang-${locale}`} data-page-root>
      <p className="not-found-code" data-reveal>404</p>
      <h1 className={locale === 'fa' ? 'lang-fa' : ''} data-reveal>{t.common.notFound}</h1>
      <Link className="button button--accent" to={`/${locale}/`}>
        <span>{t.common.backHome}</span>
        {locale === 'fa' ? <ArrowUpLeft size={17} aria-hidden="true" /> : <ArrowUpRight size={17} aria-hidden="true" />}
      </Link>
    </div>
  );
}
