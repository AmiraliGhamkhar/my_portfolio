import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { labels, type Locale } from '../content';
import { pathForLocale } from '../lib/locale';

interface Props {
  locale: Locale;
}

const navKeys = ['about', 'expertise', 'projects', 'experience', 'contact'] as const;
type NavKey = typeof navKeys[number];

export function Navigation({ locale }: Props) {
  const location = useLocation();
  const t = labels[locale];
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<NavKey>('about');
  const onHome = new RegExp(`^/${locale}/?$`).test(location.pathname);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!menuOpen) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = oldOverflow; };
  }, [menuOpen]);

  useEffect(() => {
    const sections = navKeys.map((key) => document.getElementById(key)).filter((item): item is HTMLElement => Boolean(item));
    if (!sections.length || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id as NavKey);
    }, { rootMargin: '-22% 0px -62% 0px', threshold: [0, 0.2, 0.5] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname]);

  const closeMenu = () => setMenuOpen(false);
  const switchPath = pathForLocale(location.pathname, location.search, location.hash, locale === 'fa' ? 'en' : 'fa');

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="brand" to={`/${locale}/`} aria-label={locale === 'fa' ? 'امیرعلی غمخوار، خانه' : 'Amirali Ghamkhar, home'} onClick={closeMenu}>
            <span className="brand__mark">AG<span>.</span></span>
            <span className="brand__wordmark"><strong>{locale === 'fa' ? 'امیرعلی غمخوار' : 'Amirali Ghamkhar'}</strong><small>{locale === 'fa' ? 'مهندسی هوش مصنوعی' : 'AI ENGINEERING'}</small></span>
          </Link>
          <nav className="desktop-nav" aria-label={locale === 'fa' ? 'ناوبری اصلی' : 'Main navigation'}>
            {navKeys.map((key) => (
              <a
                key={key}
                className={`nav-link ${(onHome && active === key) || (!onHome && key === 'projects' && location.pathname.includes('/projects')) ? 'is-active' : ''}`}
                href={`/${locale}/#${key}`}
                aria-current={onHome && active === key ? 'location' : undefined}
              >
                {t.nav[key]}
              </a>
            ))}
            <span className="nav-divider" aria-hidden="true" />
            <Link className="language-link" to={switchPath} lang={locale === 'fa' ? 'en' : 'fa'} dir={locale === 'fa' ? 'ltr' : 'rtl'} aria-label={locale === 'fa' ? 'Switch to English' : 'تغییر زبان به فارسی'}>
              <span className="language-link__dot" aria-hidden="true" />{t.common.language}
            </Link>
          </nav>
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? t.common.close : t.common.menu} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <div className={`mobile-navigation ${menuOpen ? 'is-open' : ''}`} id="mobile-navigation" aria-hidden={!menuOpen} inert={!menuOpen}>
        <div className="mobile-navigation__top"><span>AMIRALI / GHAMKHAR</span><button type="button" onClick={closeMenu} aria-label={t.common.close}><X size={22} /></button></div>
        <nav aria-label={locale === 'fa' ? 'ناوبری موبایل' : 'Mobile navigation'}>
          {navKeys.map((key, index) => (
            <a key={key} href={`/${locale}/#${key}`} onClick={closeMenu}>
              <span className="mobile-nav-index">0{index + 1}</span><span>{t.nav[key]}</span><ArrowUpRight size={19} aria-hidden="true" />
            </a>
          ))}
        </nav>
        <Link className="mobile-language" to={switchPath} onClick={closeMenu} lang={locale === 'fa' ? 'en' : 'fa'} dir={locale === 'fa' ? 'ltr' : 'rtl'}>
          <span className="language-link__dot" aria-hidden="true" />{t.common.language}<ArrowUpRight size={17} aria-hidden="true" />
        </Link>
        <p className="mobile-navigation__foot">{locale === 'fa' ? 'ایده‌ها را به سیستم‌های هوشمند تبدیل می‌کنم.' : 'Turning ideas into intelligent systems.'}</p>
      </div>
      {menuOpen ? <button className="mobile-navigation__scrim" type="button" aria-label={t.common.close} onClick={closeMenu} /> : null}
    </>
  );
}
