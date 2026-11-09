import { useLocation } from 'react-router';
import { projectForPath, profileByLocale, type Locale } from '../content';
import { useSiteContent } from '../lib/SiteContent';

const ORIGIN = 'https://amiralighamkhar.ir';

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
    url: `${ORIGIN}/${locale}/`,
    jobTitle: profile.role,
    sameAs: [profile.githubUrl].filter(Boolean),
    knowsAbout: [
      'Artificial intelligence',
      'Medical AI',
      'Speech recognition',
      'Software engineering',
      'Natural language processing',
    ],
  };

  const schema = project
    ? {
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: project[locale].title,
        description: project[locale].summary,
        url: `${ORIGIN}${location.pathname}`,
        inLanguage: locale,
        codeRepository: project.githubUrl || undefined,
        programmingLanguage: project.technologies,
        author: { '@context': 'https://schema.org', ...person },
      }
    : {
        '@context': 'https://schema.org',
        '@graph': [
          { '@context': 'https://schema.org', ...person, mainEntityOfPage: `${ORIGIN}/` },
          { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Amirali Ghamkhar', url: `${ORIGIN}/`, inLanguage: locale },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: locale === 'fa' ? 'پروژه‌های منتخب' : 'Selected projects',
            itemListElement: projects.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `${ORIGIN}/${locale}/projects/${item.slug}/`,
              name: item[locale].title,
            })),
          },
        ],
      };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />;
}
