import type { Locale } from '../content';
import { Hero } from '../sections/Hero';
import { SelectedWork } from '../sections/SelectedWork';
import { About } from '../sections/About';
import { Capabilities } from '../sections/Capabilities';
import { Technology } from '../sections/Technology';
import { Research } from '../sections/Research';
import { Experience } from '../sections/Experience';
import { Publications } from '../sections/Publications';
import { Achievements } from '../sections/Achievements';
import { Contact } from '../sections/Contact';

export function HomePage({ locale }: { locale: Locale }) {
  return (
    <div className={`page page--home lang-${locale}`} data-page-root>
      <Hero locale={locale} />
      <SelectedWork locale={locale} />
      <About locale={locale} />
      <Capabilities locale={locale} />
      <Technology locale={locale} />
      <Research locale={locale} />
      <Experience locale={locale} />
      <Publications locale={locale} />
      <Achievements locale={locale} />
      <Contact locale={locale} />
    </div>
  );
}
