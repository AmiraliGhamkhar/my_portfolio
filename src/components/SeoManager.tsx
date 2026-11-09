import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { getSeoForPath } from '../lib/seo';
import type { Locale } from '../content';
import { useSiteContent } from '../lib/SiteContent';

function setMeta(selector: string, attribute: string, value: string) {
  let node = document.head.querySelector<HTMLMetaElement>(selector);
  if (!node) {
    node = document.createElement('meta');
    const [key, name] = selector.match(/\[(name|property)="([^"]+)"\]/)?.slice(1) ?? [];
    if (key && name) node.setAttribute(key, name);
    document.head.appendChild(node);
  }
  node.setAttribute(attribute, value);
}

function setLink(rel: string, hreflang: string | null, href: string) {
  const selector = `link[rel="${rel}"]${hreflang ? `[hreflang="${hreflang}"]` : ''}`;
  let node = document.head.querySelector<HTMLLinkElement>(selector);
  if (!node) {
    node = document.createElement('link');
    node.rel = rel;
    if (hreflang) node.hreflang = hreflang;
    document.head.appendChild(node);
  }
  node.href = href;
}

export function SeoManager({ locale }: { locale: Locale }) {
  const location = useLocation();
  const { profile, projects, publicSettings } = useSiteContent();
  useEffect(() => {
    const baseSeo = getSeoForPath(location.pathname);
    const projectSlug = location.pathname.match(/\/projects\/([^/]+)/)?.[1];
    const project = projectSlug ? projects.find((item) => item.slug === projectSlug) : undefined;
    const isHome = new RegExp(`^/${locale}/?$`).test(location.pathname);
    const localizedProject = project?.[locale];
    const globalTitle = publicSettings[`global_seo_title_${locale}`]?.trim();
    const globalDescription = publicSettings[`global_seo_description_${locale}`]?.trim();
    const seo = {
      ...baseSeo,
      ...(isHome ? { title: globalTitle || profile.seoTitle, description: globalDescription || profile.seoDescription } : {}),
      ...(localizedProject ? { title: localizedProject.seoTitle, description: localizedProject.seoDescription, type: 'article' as const } : {}),
    };
    const socialImage = project?.coverUrl || publicSettings.og_image || profile.portraitUrl || '/og-card.svg';
    const absoluteSocialImage = socialImage.startsWith('/') ? `https://amiralighamkhar.ir${socialImage}` : socialImage;

    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr';
    document.title = seo.title;
    setMeta('meta[name="description"]', 'content', seo.description);
    setMeta('meta[property="og:title"]', 'content', seo.title);
    setMeta('meta[property="og:description"]', 'content', seo.description);
    setMeta('meta[property="og:url"]', 'content', seo.canonical);
    setMeta('meta[property="og:type"]', 'content', seo.type);
    setMeta('meta[property="og:locale"]', 'content', locale === 'fa' ? 'fa_IR' : 'en_US');
    setMeta('meta[name="twitter:title"]', 'content', seo.title);
    setMeta('meta[name="twitter:description"]', 'content', seo.description);
    if (absoluteSocialImage) {
      setMeta('meta[property="og:image"]', 'content', absoluteSocialImage);
      setMeta('meta[name="twitter:image"]', 'content', absoluteSocialImage);
    } else {
      document.head.querySelector('meta[property="og:image"]')?.remove();
      document.head.querySelector('meta[name="twitter:image"]')?.remove();
    }
    setLink('canonical', null, seo.canonical);
    const localePrefix = location.pathname.replace(/^\/(?:fa|en)(?=\/|$)/, '');
    let normalized = localePrefix ? (localePrefix.startsWith('/') ? localePrefix : `/${localePrefix}`) : '/';
    if (normalized !== '/' && !normalized.endsWith('/')) normalized += '/';
    const fa = `https://amiralighamkhar.ir/fa${normalized}`;
    const en = `https://amiralighamkhar.ir/en${normalized}`;
    setLink('alternate', 'fa', fa);
    setLink('alternate', 'en', en);
    setLink('alternate', 'x-default', fa);
  }, [location.pathname, locale, profile, projects, publicSettings]);
  return null;
}
