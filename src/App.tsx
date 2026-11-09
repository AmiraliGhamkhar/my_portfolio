import { useLayoutEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useParams } from 'react-router';
import { Footer } from './components/Footer';
import { Navigation } from './components/Navigation';
import { SeoManager } from './components/SeoManager';
import { StructuredData } from './components/StructuredData';
import { labels, type Locale } from './content';
import { SiteContentProvider, useSiteContent } from './lib/SiteContent';
import { isLocale } from './lib/locale';
import { useRevealAnimations } from './hooks/useRevealAnimations';
import { HomePage } from './pages/HomePage';
import { ContactPage, NotFoundPage, ProjectDetailPage, ProjectsPage } from './pages/ProjectPages';
import { AdminApp } from './pages/admin/AdminApp';

function ScrollProgress() {
  return <div className="scroll-progress" data-scroll-progress aria-hidden="true" />;
}

function PublicLayout({ locale }: { locale: Locale }) {
  const location = useLocation();
  const data = useSiteContent();
  useRevealAnimations(location.pathname);
  useLayoutEffect(() => {
    if (!location.hash) return;
    const id = window.setTimeout(() => document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView(), 80);
    return () => window.clearTimeout(id);
  }, [location.pathname, location.hash]);

  return (
    <div id="top" className={`public-shell public-shell--${locale}`}>
      <a className="skip-link" href="#main">{labels[locale].common.skip}</a>
      <ScrollProgress />
      <SeoManager locale={locale} />
      <Navigation locale={locale} />
      <main id="main" className="main-content">
        <Outlet />
      </main>
      <Footer locale={locale} githubUrl={data.profile.githubUrl} />
      <StructuredData locale={locale} />
    </div>
  );
}

function LocaleLayout() {
  const { lang } = useParams<{ lang: string }>();
  if (!isLocale(lang)) return <Navigate to="/fa/" replace />;
  return (
    <SiteContentProvider locale={lang}>
      <PublicLayout locale={lang} />
    </SiteContentProvider>
  );
}

function AdminRoute() {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.lang = 'fa';
    document.documentElement.dir = 'rtl';
    document.title = 'مدیریت وب‌سایت — امیرعلی غمخوار';
  }, [location.pathname]);
  return <AdminApp />;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/fa/" replace />} />
      <Route path="/admin/*" element={<AdminRoute />} />
      <Route path="/:lang" element={<LocaleLayout />}>
        <Route index element={<HomeRoute />} />
        <Route path="projects" element={<ProjectsRoute />} />
        <Route path="projects/:slug" element={<ProjectDetailRoute />} />
        <Route path="contact" element={<ContactRoute />} />
        <Route path="*" element={<NotFoundRoute />} />
      </Route>
      <Route path="*" element={<Navigate to="/fa/" replace />} />
    </Routes>
  );
}

function CurrentLocale() {
  const { lang } = useParams<{ lang: string }>();
  return isLocale(lang) ? lang : 'fa';
}
function HomeRoute() { const locale = CurrentLocale(); return <HomePage locale={locale} />; }
function ProjectsRoute() { const locale = CurrentLocale(); return <ProjectsPage locale={locale} />; }
function ProjectDetailRoute() { const locale = CurrentLocale(); return <ProjectDetailPage locale={locale} />; }
function ContactRoute() { const locale = CurrentLocale(); return <ContactPage locale={locale} />; }
function NotFoundRoute() { const locale = CurrentLocale(); return <NotFoundPage locale={locale} />; }
