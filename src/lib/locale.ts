import type { Locale } from '../content';

export function pathForLocale(pathname: string, search: string, hash: string, nextLocale: Locale): string {
  const tail = pathname.replace(/^\/(?:fa|en)(?=\/|$)/, '');
  const normalized = tail === '' ? '/' : tail.startsWith('/') ? tail : `/${tail}`;
  return `/${nextLocale}${normalized}${search}${hash}`;
}

export function isLocale(value: string | undefined): value is Locale {
  return value === 'fa' || value === 'en';
}
