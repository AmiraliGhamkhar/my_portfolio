import { useState, type FormEvent } from 'react';
import { ArrowUpLeft, ArrowUpRight, Check } from 'lucide-react';
import { apiRequest, getCsrfToken } from '../lib/api';
import { labels, type Locale } from '../content';

interface Props { locale: Locale; }

export function ContactForm({ locale }: Props) {
  const t = labels[locale].contact;
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus('sending');
    try {
      const csrf = await getCsrfToken();
      await apiRequest('/api/v1/contact', {
        method: 'POST',
        headers: { 'X-CSRF-Token': csrf },
        body: JSON.stringify({
          name: String(formData.get('name') || '').trim(),
          email: String(formData.get('email') || '').trim(),
          message: String(formData.get('message') || '').trim(),
          website: String(formData.get('website') || ''),
        }),
      });
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="contact-form__fields">
        <label className="form-field">
          <span>{t.name}<span aria-hidden="true"> *</span></span>
          <input name="name" type="text" required maxLength={120} autoComplete="name" placeholder={t.namePlaceholder} />
        </label>
        <label className="form-field">
          <span>{t.emailField}<span aria-hidden="true"> *</span></span>
          <input name="email" type="email" required maxLength={254} autoComplete="email" placeholder={t.emailPlaceholder} dir="ltr" />
        </label>
        <label className="form-field form-field--wide">
          <span>{t.message}<span aria-hidden="true"> *</span></span>
          <textarea name="message" required minLength={10} maxLength={4000} rows={4} placeholder={t.messagePlaceholder} />
        </label>
        <label className="form-field form-field--trap" aria-hidden="true" tabIndex={-1}>
          <span>Leave this field empty</span><input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="contact-form__bottom">
        <button className="button button--accent" type="submit" disabled={status === 'sending'}>
          <span>{status === 'sending' ? t.sending : t.send}</span>
          {locale === 'fa' ? <ArrowUpLeft size={17} aria-hidden="true" /> : <ArrowUpRight size={17} aria-hidden="true" />}
        </button>
        <p className={`form-status form-status--${status}`} role="status" aria-live="polite">
          {status === 'success' ? <><Check size={16} />{t.success}</> : status === 'error' ? t.error : null}
        </p>
      </div>
    </form>
  );
}
