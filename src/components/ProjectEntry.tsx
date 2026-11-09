import { ArrowUpLeft, ArrowUpRight, MoveUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { labels, systemFlows, type Locale, type Project } from '../content';
import { SystemFigure } from './SystemFigure';

interface Props {
  project: Project;
  locale: Locale;
  flagship?: boolean;
}

export function ProjectEntry({ project, locale, flagship = false }: Props) {
  const t = labels[locale];
  const content = project[locale];
  const flow = systemFlows[project.slug]?.[locale];
  const caseStudy = content.caseStudy;
  const caseStudyPath = `/${locale}/projects/${project.slug}/`;
  const Outbound = locale === 'fa' ? ArrowUpLeft : ArrowUpRight;

  return (
    <article className={`project-entry ${flagship ? 'project-entry--flagship' : ''}`} data-reveal>
      <header className="project-entry__head">
        <span className="project-entry__index" aria-hidden="true">{project.number}</span>
        <div>
          <p className="project-entry__category">{content.category}</p>
          <h3 className="project-entry__title">
            <Link to={caseStudyPath}>{content.title}</Link>
          </h3>
        </div>
        <div className="project-entry__links">
          {project.githubUrl ? (
            <a className="text-link" href={project.githubUrl} target="_blank" rel="noreferrer" dir="ltr">
              <span>{t.projects.repository}</span>
              <MoveUpRight size={14} aria-hidden="true" />
            </a>
          ) : null}
          <Link className="text-link" to={caseStudyPath}>
            <span>{t.projects.open}</span>
            <Outbound size={14} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <p className="project-entry__summary">{content.summary}</p>

      <div className={`project-entry__grid ${flow ? '' : 'project-entry__grid--text'}`}>
        {flow ? (
          <div>
            <SystemFigure locale={locale} caption={flow.caption} stages={flow.stages} foot={flow.foot} compact={!flagship} />
          </div>
        ) : null}
        <div className="project-entry__case">
          {caseStudy.problem ? (
            <div className="case-block">
              <span className="case-block__label">{t.projects.problem}</span>
              <p className="case-block__text">{caseStudy.problem}</p>
            </div>
          ) : null}
          {caseStudy.solution ? (
            <div className="case-block">
              <span className="case-block__label">{t.projects.solution}</span>
              <p className="case-block__text">{caseStudy.solution}</p>
            </div>
          ) : null}
          {caseStudy.engineering.length ? (
            <div className="case-block">
              <span className="case-block__label">{t.projects.engineering}</span>
              <ul className="case-block__list">
                {caseStudy.engineering.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ) : null}
          {caseStudy.outcome ? (
            <div className="case-block">
              <span className="case-block__label">{t.projects.outcome}</span>
              <p className="case-block__text">{caseStudy.outcome}</p>
            </div>
          ) : null}
          {content.note ? (
            <div className="project-entry__scope">
              <b>{t.project.scope}</b>
              {content.note}
            </div>
          ) : null}
        </div>
      </div>

      <footer className="project-entry__foot">
        <div className="tag-list">
          {project.technologies.map((tech) => <span className="tag" key={tech} dir="ltr">{tech}</span>)}
        </div>
        {project.liveUrl ? (
          <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer">
            <span>{t.projects.live}</span>
            <Outbound size={14} aria-hidden="true" />
          </a>
        ) : null}
      </footer>
    </article>
  );
}
