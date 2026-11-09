import { useEffect, useState } from 'react';
import {
  expertiseByLocale,
  interestsByLocale,
  profileByLocale,
  projects as localProjects,
  technologies as localTechnologies,
  type ExpertiseItem,
  type Locale,
  type Profile,
  type Project,
  type ProjectImage,
} from '../content';
import { apiRequest, type PublicProjectRecord } from './api';

export interface ExperienceRecord {
  id: number;
  title: string;
  organization: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
}

export interface EducationRecord {
  id: number;
  title: string;
  institution: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
}

export interface PublicTextRecord extends Record<string, unknown> {
  id: number;
  title: string;
  description?: string;
  url?: string;
  published_at?: string;
  category?: string;
  label?: string;
  platform?: string;
  venue?: string;
  authors?: string;
  abstract?: string;
  issuer?: string;
  awarded_at?: string;
}

export interface SocialLinkRecord {
  id: number;
  label: string;
  platform: string;
  url: string;
}

export interface SiteData {
  profile: Profile;
  projects: Project[];
  expertise: ExpertiseItem[];
  technologies: typeof localTechnologies;
  experience: ExperienceRecord[];
  education: EducationRecord[];
  research: PublicTextRecord[];
  publications: PublicTextRecord[];
  achievements: PublicTextRecord[];
  socialLinks: SocialLinkRecord[];
  publicSettings: Record<string, string>;
  interests: string[];
  researchConfigured: boolean;
}

interface ApiProfile extends Record<string, unknown> {
  name?: string;
  role?: string;
  hero_greeting?: string;
  statement?: string;
  about?: string;
  email?: string;
  github_url?: string;
  linkedin_url?: string;
  portrait_url?: string;
  seo_title?: string;
  seo_description?: string;
}

interface ApiExpertise extends Record<string, unknown> {
  number?: string;
  icon?: ExpertiseItem['icon'];
  title?: string;
  description?: string;
}

interface ApiTechnology extends Record<string, unknown> {
  category?: string;
  name?: string;
}

const icons: ExpertiseItem['icon'][] = ['brain', 'heart', 'code', 'sparkles'];

function initialData(locale: Locale): SiteData {
  return {
    profile: profileByLocale[locale],
    projects: localProjects,
    expertise: expertiseByLocale[locale],
    technologies: localTechnologies,
    experience: [],
    education: [],
    research: [],
    publications: [],
    achievements: [],
    socialLinks: [],
    publicSettings: {},
    interests: interestsByLocale[locale],
    researchConfigured: false,
  };
}

function mapRemoteProject(record: PublicProjectRecord, locale: Locale, index: number, fallback?: Project): Project {
  const translation = fallback?.[locale];
  const remoteDetails = Array.isArray(record.details)
    ? record.details.filter((item): item is string => typeof item === 'string')
    : [];
  const details = remoteDetails.length ? remoteDetails : translation?.details ?? [];
  const nextTranslation = {
    title: record.title || translation?.title || record.slug,
    category: record.category || translation?.category || '',
    summary: record.summary || translation?.summary || '',
    description: record.description || record.case_study || translation?.description || '',
    details,
    seoTitle: record.seo_title || translation?.seoTitle || record.title || record.slug,
    seoDescription: record.seo_description || translation?.seoDescription || record.summary || '',
    ...(translation?.note ? { note: translation.note } : {}),
  };
  const otherLocale = locale === 'fa' ? 'en' : 'fa';
  const otherTranslation = fallback?.[otherLocale] ?? {
    title: record.slug,
    category: '',
    summary: '',
    description: '',
    details: [],
    seoTitle: record.slug,
    seoDescription: '',
  };
  const images: ProjectImage[] = Array.isArray(record.images)
    ? record.images.filter((image) => image && typeof image.url === 'string').map((image) => ({ id: image.id, url: image.url, alt: image.alt || '' }))
    : fallback?.images ?? [];

  return {
    id: String(record.id ?? fallback?.id ?? record.slug),
    slug: record.slug,
    number: fallback?.number ?? String(index + 1).padStart(2, '0'),
    accent: fallback?.accent ?? (['lime', 'blue', 'orange'] as const)[index % 3],
    featured: Boolean(record.featured ?? fallback?.featured),
    githubUrl: record.github_url || fallback?.githubUrl || '',
    liveUrl: record.live_url || fallback?.liveUrl || '',
    coverUrl: record.cover_url || fallback?.coverUrl || '',
    technologies: Array.isArray(record.technologies) ? record.technologies : fallback?.technologies ?? [],
    images,
    fa: locale === 'fa' ? nextTranslation : otherTranslation,
    en: locale === 'en' ? nextTranslation : otherTranslation,
  };
}

function mergeProfile(current: Profile, record: ApiProfile): Profile {
  return {
    ...current,
    name: typeof record.name === 'string' && record.name ? record.name : current.name,
    role: typeof record.role === 'string' && record.role ? record.role : current.role,
    greeting: typeof record.hero_greeting === 'string' && record.hero_greeting ? record.hero_greeting : current.greeting,
    statement: typeof record.statement === 'string' && record.statement ? record.statement : current.statement,
    about: typeof record.about === 'string' && record.about ? record.about : current.about,
    email: typeof record.email === 'string' ? record.email : current.email,
    githubUrl: typeof record.github_url === 'string' ? record.github_url : current.githubUrl,
    linkedinUrl: typeof record.linkedin_url === 'string' ? record.linkedin_url : current.linkedinUrl,
    portraitUrl: typeof record.portrait_url === 'string' ? record.portrait_url : current.portraitUrl,
    seoTitle: typeof record.seo_title === 'string' && record.seo_title ? record.seo_title : current.seoTitle,
    seoDescription: typeof record.seo_description === 'string' && record.seo_description ? record.seo_description : current.seoDescription,
  };
}

function collection<T>(result: PromiseSettledResult<{ items: T[] }>): T[] | null {
  return result.status === 'fulfilled' && Array.isArray(result.value.items) ? result.value.items : null;
}

export function usePortfolioData(locale: Locale): SiteData {
  const [data, setData] = useState(() => initialData(locale));

  useEffect(() => {
    let active = true;
    setData(initialData(locale));

    async function refresh() {
      const endpoints = [
        apiRequest<ApiProfile>(`/api/v1/profile?lang=${locale}`),
        apiRequest<{ items: PublicProjectRecord[] }>(`/api/v1/projects?lang=${locale}`),
        apiRequest<{ items: ApiExpertise[] }>(`/api/v1/expertise?lang=${locale}`),
        apiRequest<{ items: ApiTechnology[] }>(`/api/v1/technologies?lang=${locale}`),
        apiRequest<{ items: ExperienceRecord[] }>(`/api/v1/experience?lang=${locale}`),
        apiRequest<{ items: EducationRecord[] }>(`/api/v1/education?lang=${locale}`),
        apiRequest<{ items: PublicTextRecord[] }>(`/api/v1/research?lang=${locale}`),
        apiRequest<{ items: PublicTextRecord[] }>(`/api/v1/publications?lang=${locale}`),
        apiRequest<{ items: PublicTextRecord[] }>(`/api/v1/achievements?lang=${locale}`),
        apiRequest<{ items: SocialLinkRecord[] }>(`/api/v1/social-links?lang=${locale}`),
        apiRequest<Record<string, string>>(`/api/v1/settings?lang=${locale}`),
      ] as const;
      const [profileResult, projectsResult, expertiseResult, technologiesResult, experienceResult, educationResult, researchResult, publicationsResult, achievementsResult, socialResult, settingsResult] = await Promise.allSettled(endpoints);
      if (!active) return;

      setData((current) => {
        const next = { ...current };
        if (profileResult.status === 'fulfilled') next.profile = mergeProfile(current.profile, profileResult.value);
        const remoteProjects = collection(projectsResult);
        if (remoteProjects?.length) {
          const fallbacks = new Map(current.projects.map((project) => [project.slug, project]));
          next.projects = remoteProjects.map((item, index) => mapRemoteProject(item, locale, index, fallbacks.get(item.slug)));
        }
        const remoteExpertise = collection(expertiseResult);
        if (remoteExpertise?.length) {
          next.expertise = remoteExpertise.map((item, index) => ({
            number: String(item.number ?? String(index + 1).padStart(2, '0')),
            icon: icons.includes(item.icon as ExpertiseItem['icon']) ? item.icon as ExpertiseItem['icon'] : icons[index % icons.length],
            title: String(item.title ?? ''),
            description: String(item.description ?? ''),
          }));
        }
        const remoteTechnologies = collection(technologiesResult);
        if (remoteTechnologies?.length) {
          const groups = new Map<string, string[]>();
          remoteTechnologies.forEach((item) => {
            const group = String(item.category || 'Other');
            const name = String(item.name || '');
            if (!name) return;
            groups.set(group, [...(groups.get(group) ?? []), name]);
          });
          next.technologies = [...groups].map(([group, items]) => ({ group, faGroup: group, items }));
        }
        const experience = collection(experienceResult);
        if (experience?.length) next.experience = experience;
        const education = collection(educationResult);
        if (education?.length) next.education = education;
        const research = collection(researchResult);
        if (research?.length) { next.research = research; next.researchConfigured = true; }
        const publications = collection(publicationsResult);
        if (publications?.length) next.publications = publications;
        const achievements = collection(achievementsResult);
        if (achievements?.length) next.achievements = achievements;
        const social = collection(socialResult);
        if (social?.length) next.socialLinks = social;
        if (settingsResult.status === 'fulfilled') next.publicSettings = settingsResult.value;
        return next;
      });
    }

    void refresh();
    return () => { active = false; };
  }, [locale]);

  return data;
}
