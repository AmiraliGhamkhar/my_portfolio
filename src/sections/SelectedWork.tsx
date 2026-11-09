import { MoveUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { labels, type Locale } from '../content';
import { useSiteContent } from '../lib/SiteContent';
import { SectionHeading } from '../components/SectionHeading';
import { ProjectEntry } from '../components/ProjectEntry';

export function SelectedWork({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  const t = labels[locale];
  const featured = data.projects.filter((project) => project.featured);
  const rest = data.projects.filter((project) => !project.featured);
  const ordered = [...featured, ...rest];

  return (
    <section className="section section--alt rule-top" id="work">
      <SectionHeading
        locale={locale}
        {...t.section.work}
        aside={
          data.projects.length ? (
            <Link className="text-link" to={`/${locale}/projects/`}>
              <span>{t.projects.viewAll}</span>
              <MoveUpRight size={15} aria-hidden="true" />
            </Link>
          ) : null
        }
      />
      {ordered.length ? (
        <div className="work-list">
          {ordered.map((project, index) => (
            <ProjectEntry key={project.slug} project={project} locale={locale} flagship={index === 0} />
          ))}
        </div>
      ) : (
        <p className="section-empty" data-reveal>{t.projects.empty}</p>
      )}
    </section>
  );
}
