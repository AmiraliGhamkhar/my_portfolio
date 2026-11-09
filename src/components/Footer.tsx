import { ArrowUp, Github, MoveUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { labels, type Locale } from '../content';

interface Props { locale: Locale; githubUrl: string; }

export function Footer({ locale, githubUrl }: Props) {
  const t = labels[locale];
  const otherLocale = locale === 'fa' ? 'en' : 'fa';

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <Link className="footer-brand" to={`/${locale}/`}>
            <span className="brand__mark">AG<span>.</span></span>
            <span>
              <strong>{locale === 'fa' ? 'امیرعلی غمخوار' : 'Amirali Ghamkhar'}</strong>
              <small>{t.footer.note}</small>
            </span>
          </Link>
          <div className="footer-links">
            {githubUrl ? (
              <a className="footer-social" href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub profile">
                <Github size={17} aria-hidden="true" />
                <span>GitHub</span>
                <MoveUpRight size={14} aria-hidden="true" />
              </a>
            ) : null}
            <Link className="footer-social" to={`/${otherLocale}/`} lang={otherLocale} dir={otherLocale === 'fa' ? 'rtl' : 'ltr'}>
              {otherLocale === 'fa' ? 'فارسی' : 'English'}
            </Link>
            <a className="back-to-top" href="#top">
              <span>{t.footer.backToTop}</span>
              <ArrowUp size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} {locale === 'fa' ? 'امیرعلی غمخوار' : 'Amirali Ghamkhar'}. {t.footer.rights}</span>
        </div>
      </div>
    </footer>
  );
}
