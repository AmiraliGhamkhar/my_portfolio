import { useLocation } from 'react-router';
import { projectForPath, profileByLocale, type Locale } from '../content';
import { siteUrl } from '../lib/seo';
import { useSiteContent } from '../lib/SiteContent';

export function StructuredData({ locale }: { locale: Locale }) {
  const location = useLocation();
  const { profile, projects } = useSiteContent();
  const fallback = profileByLocale[locale];
  const slug = location.pathname.match(/\/projects\/([^/]+)/)?.[1];
  const project = slug ? projects.find((item) => item.slug === slug) : projectForPath(location.pathname);
  const name = profile.name || fallback.name;
  const person = {
    '@type': 'Person',
    name,
    url: siteUrl(`/${locale}/`),
    jobTitle: profile.role,
    sameAs: [profile.githubUrl].filter(Boolean),
    knowsAbout: ['Artificial intelligence', 'Medical AI', 'Software engineering', 'Speech processing'],
  };
  const schema = project
    ? {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project[locale].title,
        description: project[locale].summary,
        url: siteUrl(location.pathname),
        inLanguage: locale,
        creator: person,
        sameAs: project.githubUrl ? [project.githubUrl] : [],
      }
    : {
        '@context': 'https://schema.org',
        '@graph': [
          { '@context': 'https://schema.org', ...person, mainEntityOfPage: siteUrl('/') },
          { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Amirali Ghamkhar', url: siteUrl('/'), inLanguage: locale },
        ],
      };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />;
}
