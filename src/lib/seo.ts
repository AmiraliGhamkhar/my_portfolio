import { localeFromPath, profileByLocale, projectForPath, type Locale } from '../content';

export interface PageSeo {
  locale: Locale;
  title: string;
  description: string;
  canonical: string;
  type: 'website' | 'article';
}

const ORIGIN = 'https://amiralighamkhar.ir';

export function getSeoForPath(pathname: string): PageSeo {
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const locale = localeFromPath(cleanPath);
  const profile = profileByLocale[locale];
  const project = projectForPath(cleanPath);
  const localizedProject = project?.[locale];

  if (localizedProject) {
    return {
      locale,
      title: localizedProject.seoTitle,
      description: localizedProject.seoDescription,
      canonical: `${ORIGIN}${cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`}`,
      type: 'article',
    };
  }
  if (/\/projects\/[^/]+\/?$/.test(cleanPath)) {
    const canonicalPath = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
    return {
      locale,
      title: locale === 'fa' ? 'مطالعهٔ موردی پروژه — امیرعلی غمخوار' : 'Project case study — Amirali Ghamkhar',
      description: locale === 'fa' ? 'مطالعهٔ موردی یک پروژه از امیرعلی غمخوار.' : 'A project case study by Amirali Ghamkhar.',
      canonical: `${ORIGIN}${canonicalPath}`,
      type: 'article',
    };
  }
  if (/\/projects\/?$/.test(cleanPath)) {
    return {
      locale,
      title: locale === 'fa' ? 'پروژه‌ها — امیرعلی غمخوار' : 'Projects — Amirali Ghamkhar',
      description: locale === 'fa' ? 'پروژه‌های منتخب در هوش مصنوعی، گفتار و مهندسی نرم‌افزار.' : 'Selected projects across AI, speech, and software engineering.',
      canonical: `${ORIGIN}/${locale}/projects/`,
      type: 'website',
    };
  }
  if (/\/contact\/?$/.test(cleanPath)) {
    return {
      locale,
      title: locale === 'fa' ? 'ارتباط — امیرعلی غمخوار' : 'Contact — Amirali Ghamkhar',
      description: locale === 'fa' ? 'برای همکاری یا گفت‌وگو با امیرعلی غمخوار در ارتباط باشید.' : 'Get in touch with Amirali Ghamkhar about a collaboration or conversation.',
      canonical: `${ORIGIN}/${locale}/contact/`,
      type: 'website',
    };
  }
  if (cleanPath === '/admin/' || cleanPath.startsWith('/admin/')) {
    return {
      locale: 'en',
      title: 'Portfolio Admin — Amirali Ghamkhar',
      description: 'Private portfolio content management.',
      canonical: `${ORIGIN}/admin/`,
      type: 'website',
    };
  }
  return {
    locale,
    title: profile.seoTitle,
    description: profile.seoDescription,
    canonical: `${ORIGIN}/${locale}/`,
    type: 'website',
  };
}
