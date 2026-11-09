import { useState, type FormEvent } from 'react';
import { ArrowUpLeft, ArrowUpRight, Check, Send } from 'lucide-react';
import { apiRequest, getCsrfToken } from '../lib/api';
import { labels, type Locale } from '../content';

interface Props { locale: Locale; }

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

export function ContactForm({ locale }: Props) {
  const t = labels[locale].contact;
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Errors>({});

  const validate = (form: HTMLFormElement): Errors => {
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const next: Errors = {};
    if (!name) next.name = t.required;
    if (!email) next.email = t.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = t.invalidEmail;
    if (!message) next.message = t.required;
    else if (message.length < 10) next.message = t.shortMessage;
    return next;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      const firstInvalid = form.querySelector<HTMLElement>('[aria-invalid="true"]');
      firstInvalid?.focus();
      return;
    }
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

  const Outbound = locale === 'fa' ? ArrowUpLeft : ArrowUpRight;

  return (
    <form className="contact-form" onSubmit={onSubmit} data-reveal noValidate>
      <div className="contact-form__fields">
        <label className="form-field">
          <span>{t.name}<span className="required" aria-hidden="true"> *</span></span>
          <input
            name="name" type="text" required maxLength={120} autoComplete="name"
            placeholder={t.namePlaceholder}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
          />
          {errors.name ? <span className="form-error" id="contact-name-error">{errors.name}</span> : null}
        </label>
        <label className="form-field">
          <span>{t.emailField}<span className="required" aria-hidden="true"> *</span></span>
          <input
            name="email" type="email" required maxLength={254} autoComplete="email"
            placeholder={t.emailPlaceholder} dir="ltr"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
          />
          {errors.email ? <span className="form-error" id="contact-email-error">{errors.email}</span> : null}
        </label>
        <label className="form-field form-field--wide">
          <span>{t.message}<span className="required" aria-hidden="true"> *</span></span>
          <textarea
            name="message" required minLength={10} maxLength={4000} rows={5}
            placeholder={t.messagePlaceholder}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
          />
          {errors.message ? <span className="form-error" id="contact-message-error">{errors.message}</span> : null}
        </label>
        <label className="form-field--trap" aria-hidden="true" tabIndex={-1}>
          <span>Leave this field empty</span>
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="contact-form__bottom">
        <button className="button button--accent" type="submit" disabled={status === 'sending'}>
          <span>{status === 'sending' ? t.sending : t.send}</span>
          {status === 'sending' ? <Send size={16} aria-hidden="true" /> : <Outbound size={16} aria-hidden="true" />}
        </button>
        <p className={`form-status form-status--${status}`} role="status" aria-live="polite">
          {status === 'success' ? <><Check size={16} aria-hidden="true" />{t.success}</> : status === 'error' ? t.error : null}
        </p>
      </div>
    </form>
  );
}
