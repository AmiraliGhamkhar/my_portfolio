import { ArrowUp, Github, MoveUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { labels, type Locale } from '../content';

interface Props { locale: Locale; githubUrl: string; }

export function Footer({ locale, githubUrl }: Props) {
  const t = labels[locale];
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <Link className="footer-brand" to={`/${locale}/`}>
          <span className="brand__mark">AG<span>.</span></span>
          <span><strong>{locale === 'fa' ? 'امیرعلی غمخوار' : 'Amirali Ghamkhar'}</strong><small>{t.footer.note}</small></span>
        </Link>
        <a className="footer-social" href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub profile">
          <Github size={18} /><span>GitHub</span><MoveUpRight size={15} />
        </a>
        <a className="back-to-top" href="#top"><span>{t.footer.backToTop}</span><ArrowUp size={16} /></a>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} {locale === 'fa' ? 'امیرعلی غمخوار' : 'Amirali Ghamkhar'}. {t.footer.rights}</span>
        <span className="footer-coordinate">AMIRALI GHAMKHAR / PORTFOLIO</span>
      </div>
    </footer>
  );
}
