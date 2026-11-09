import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, MoveUpRight } from 'lucide-react';
import { Link } from 'react-router';
import type { Locale, Project } from '../content';
import { labels } from '../content';
import { ProjectArtwork } from './ProjectArtwork';

interface Props { locale: Locale; projects: Project[]; }

export function ProjectRail({ locale, projects }: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const text = labels[locale].projects;

  const move = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const firstCard = rail.querySelector<HTMLElement>('.project-card');
    const amount = firstCard ? firstCard.offsetWidth + 20 : rail.clientWidth * 0.78;
    rail.scrollBy({ left: amount * direction, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  if (!projects.length) return <p className="projects-empty" role="status">{text.empty}</p>;

  return (
    <div className="project-rail-wrap">
      <div className="project-rail__tools">
        <span className="project-count"><b>{String(position + 1).padStart(2, '0')}</b><span> / {String(Math.max(projects.length, 1)).padStart(2, '0')}</span> <small>{text.count}</small></span>
        <div className="rail-buttons">
          <button type="button" className="icon-button" aria-label={text.previous} onClick={() => move(locale === 'fa' ? 1 : -1)}><ArrowLeft size={18} /></button>
          <button type="button" className="icon-button" aria-label={text.next} onClick={() => move(locale === 'fa' ? -1 : 1)}><ArrowRight size={18} /></button>
        </div>
      </div>
      <div
        className="project-rail"
        ref={railRef}
        dir="ltr"
        role="region"
        aria-label={locale === 'fa' ? 'پروژه‌های منتخب' : 'Selected projects'}
        tabIndex={0}
        onScroll={(event) => {
          const rail = event.currentTarget;
          const width = rail.querySelector<HTMLElement>('.project-card')?.offsetWidth ?? rail.clientWidth;
          const index = Math.round(rail.scrollLeft / Math.max(width + 20, 1));
          setPosition(Math.min(Math.max(index, 0), Math.max(projects.length - 1, 0)));
        }}
      >
        {projects.map((project) => {
          const title = project[locale];
          return (
            <article className="project-card" key={project.slug} dir={locale === 'fa' ? 'rtl' : 'ltr'} data-reveal>
              <Link to={`/${locale}/projects/${project.slug}/`} className="project-card__art-link" aria-label={`${text.open}: ${title.title}`}>
                <ProjectArtwork project={project} locale={locale} />
              </Link>
              <div className="project-card__info">
                <div className="project-card__title-line">
                  <div><span className="project-card__category">{title.category}</span><h3><Link to={`/${locale}/projects/${project.slug}/`}>{title.title}</Link></h3></div>
                  <Link to={`/${locale}/projects/${project.slug}/`} className="project-open" aria-label={`${text.open}: ${title.title}`}><MoveUpRight size={19} /></Link>
                </div>
                <p>{title.summary}</p>
                <div className="project-card__bottom">
                  <div className="tag-list">{project.technologies.map((tech) => <span className="tag" key={tech} dir="ltr">{tech}</span>)}</div>
                  {project.githubUrl ? <a className="text-link" href={project.githubUrl} target="_blank" rel="noreferrer">{text.repository}<MoveUpRight size={14} /></a> : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <div className="project-rail__progress" aria-hidden="true"><span style={{ width: `${projects.length ? ((position + 1) / projects.length) * 100 : 0}%` }} /></div>
    </div>
  );
}
