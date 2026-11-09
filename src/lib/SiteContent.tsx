import { createContext, useContext, type ReactNode } from 'react';
import type { Locale } from '../content';
import { usePortfolioData, type SiteData } from './usePortfolioData';

const SiteContentContext = createContext<SiteData | null>(null);

export function SiteContentProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const data = usePortfolioData(locale);
  return <SiteContentContext.Provider value={data}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent(): SiteData {
  const value = useContext(SiteContentContext);
  if (!value) throw new Error('useSiteContent must be used inside SiteContentProvider.');
  return value;
}
