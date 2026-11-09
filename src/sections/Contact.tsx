import { useState } from 'react';
import { Check, Copy, MoveUpRight } from 'lucide-react';
import { labels, type Locale } from '../content';
import { useSiteContent } from '../lib/SiteContent';
import { SectionHeading } from '../components/SectionHeading';
import { ContactForm } from '../components/ContactForm';

export function Contact({ locale }: { locale: Locale }) {
  const data = useSiteContent();
  const t = labels[locale];
  const [copied, setCopied] = useState(false);

  const socialLinks = data.socialLinks.length
    ? data.socialLinks
    : [
        { id: 'github', label: 'GitHub', platform: 'GitHub', url: data.profile.githubUrl },
        { id: 'linkedin', label: 'LinkedIn', platform: 'LinkedIn', url: data.profile.linkedinUrl },
      ].filter((link) => Boolean(link.url));

  const copyEmail = async () => {
    if (!data.profile.email) return;
    try {
      await navigator.clipboard.writeText(data.profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard access is optional; the mail link stays available. */
    }
  };

  return (
    <section className="section section--alt rule-top" id="contact">
      <div className="contact-layout">
        <div>
          <SectionHeading locale={locale} {...t.section.contact} />
          <p className="contact-body">{t.contact.body}</p>
          <dl className="contact-links">
            <div className="contact-link-row">
              <dt>{t.contact.email}</dt>
              <dd>
                {data.profile.email ? (
                  <>
                    <a href={`mailto:${data.profile.email}`} dir="ltr">{data.profile.email}</a>
                    <button type="button" className="contact-copy-button" onClick={copyEmail} aria-label={t.contact.copyEmail}>
                      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                    </button>
                    <span className="copy-message" aria-live="polite">{copied ? t.contact.copied : ''}</span>
                  </>
                ) : (
                  <span className="muted-note">{t.contact.noEmail}</span>
                )}
              </dd>
            </div>
            {socialLinks.map((link) => (
              <div className="contact-link-row" key={link.id}>
                <dt>{link.label || link.platform}</dt>
                <dd>
                  <a href={link.url} target="_blank" rel="noreferrer" dir="ltr">
                    <span>{displayUrl(link.url)}</span>
                    <MoveUpRight size={13} aria-hidden="true" />
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <ContactForm locale={locale} />
      </div>
    </section>
  );
}

function displayUrl(url: string): string {
  return url.replace(/^mailto:/, '').replace(/^https?:\/\/(www\.)?/, '');
}
