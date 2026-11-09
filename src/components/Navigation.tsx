import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { labels, type Locale } from '../content';
import { pathForLocale } from '../lib/locale';

const navKeys = ['work', 'about', 'research', 'contact'] as const;
type NavKey = typeof navKeys[number];

export function Navigation({ locale }: { locale: Locale }) {
  const location = useLocation();
  const t = labels[locale];
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<NavKey>('work');
  const onHome = new RegExp(`^/${locale}/?$`).test(location.pathname);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [menuOpen]);

  useEffect(() => {
    const sections = navKeys.map((key) => document.getElementById(key)).filter((item): item is HTMLElement => Boolean(item));
    if (!sections.length || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id as NavKey);
    }, { rootMargin: '-20% 0px -62% 0px', threshold: [0, 0.2, 0.5] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname]);

  const closeMenu = () => setMenuOpen(false);
  const switchPath = pathForLocale(location.pathname, location.search, location.hash, locale === 'fa' ? 'en' : 'fa');
  const isCurrent = (key: NavKey) => (onHome && active === key) || (!onHome && key === 'work' && location.pathname.includes('/projects'));

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="brand" to={`/${locale}/`} aria-label={locale === 'fa' ? 'امیرعلی غمخوار، خانه' : 'Amirali Ghamkhar, home'} onClick={closeMenu}>
            <span className="brand__mark">AG<span>.</span></span>
            <span className="brand__wordmark">
              <strong>{locale === 'fa' ? 'امیرعلی غمخوار' : 'Amirali Ghamkhar'}</strong>
              <small>{locale === 'fa' ? 'مهندسی هوش مصنوعی' : 'AI ENGINEERING'}</small>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label={locale === 'fa' ? 'ناوبری اصلی' : 'Main navigation'}>
            {navKeys.map((key) => (
              <a
                key={key}
                className={`nav-link ${isCurrent(key) ? 'is-active' : ''}`}
                href={`/${locale}/#${key}`}
                aria-current={onHome && active === key ? 'location' : undefined}
              >
                {t.nav[key]}
              </a>
            ))}
            <span className="nav-divider" aria-hidden="true" />
            <Link className="language-link" to={switchPath} lang={locale === 'fa' ? 'en' : 'fa'} dir={locale === 'fa' ? 'ltr' : 'rtl'} aria-label={locale === 'fa' ? 'Switch to English' : 'تغییر زبان به فارسی'}>
              {t.common.language}
            </Link>
          </nav>
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? t.common.close : t.common.menu} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div className={`mobile-navigation ${menuOpen ? 'is-open' : ''}`} id="mobile-navigation" aria-hidden={!menuOpen} inert={!menuOpen}>
        <div className="mobile-navigation__top">
          <span>AMIRALI / GHAMKHAR</span>
          <button type="button" onClick={closeMenu} aria-label={t.common.close}><X size={22} aria-hidden="true" /></button>
        </div>
        <nav aria-label={locale === 'fa' ? 'ناوبری موبایل' : 'Mobile navigation'}>
          {navKeys.map((key) => (
            <a key={key} href={`/${locale}/#${key}`} onClick={closeMenu}>
              <span>{t.nav[key]}</span>
              <ArrowUpRight size={19} aria-hidden="true" />
            </a>
          ))}
        </nav>
        <Link className="mobile-language" to={switchPath} onClick={closeMenu} lang={locale === 'fa' ? 'en' : 'fa'} dir={locale === 'fa' ? 'ltr' : 'rtl'}>
          {t.common.language}
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
      {menuOpen ? <button className="mobile-navigation__scrim" type="button" aria-label={t.common.close} onClick={closeMenu} /> : null}
    </>
  );
}
