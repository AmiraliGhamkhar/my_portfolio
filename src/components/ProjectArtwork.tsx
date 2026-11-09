import type { Project } from '../content';

interface Props {
  project: Project;
  locale: 'fa' | 'en';
  compact?: boolean;
}

export function ProjectArtwork({ project, locale, compact = false }: Props) {
  const content = project[locale];
  return (
    <div className={`project-art project-art--${project.accent} ${compact ? 'project-art--compact' : ''}`} aria-hidden="true">
      <div className="project-art__topline"><span>AG / FIELD NOTES</span><span>{project.number} — 03</span></div>
      <div className={`project-art__visual project-art__visual--${project.id}`}>
        {project.coverUrl ? <img className="project-art__cover" src={project.coverUrl} alt="" loading="lazy" /> : null}
        {!project.coverUrl && project.id === 'gamas-bot' ? (
          <>
            <div className="art-orbit art-orbit--one" />
            <div className="art-orbit art-orbit--two" />
            <div className="art-letter">G.</div>
            <div className="art-wave" />
            <div className="art-caption">STUDY / SIGNAL / STRUCTURE</div>
          </>
        ) : !project.coverUrl && project.id === 'gamas-website' ? (
          <>
            <div className="art-frame art-frame--one"><span>GAMAS</span><span>01 — 03</span></div>
            <div className="art-frame art-frame--two"><span>IDEAS</span><span>INTO</span><strong>SYSTEMS</strong></div>
            <div className="art-sun" />
          </>
        ) : !project.coverUrl ? (
          <>
            <div className="art-waveform" />
            <div className="art-cross"><i /><i /></div>
            <div className="art-words"><span>FA</span><span>EN</span><strong>STT</strong></div>
            <div className="art-caption">VOICE / TEXT / CONTEXT</div>
          </>
        ) : null}
      </div>
      <div className="project-art__bottomline"><span>{content.category}</span><span>{project.slug.toUpperCase()}</span></div>
    </div>
  );
}
