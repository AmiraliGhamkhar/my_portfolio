import type { Locale } from '../content';

interface Props {
  locale: Locale;
  imageUrl?: string;
}

export function Portrait({ locale, imageUrl }: Props) {
  const isPersian = locale === 'fa';
  return (
    <figure className="portrait" data-reveal>
      <div className="portrait__frame">
        {imageUrl ? (
          <img className="portrait__uploaded" src={imageUrl} alt={isPersian ? 'تصویر امیرعلی غمخوار' : 'Portrait of Amirali Ghamkhar'} loading="lazy" />
        ) : (
          <div className="portrait__art" aria-hidden="true">
            <svg viewBox="0 0 520 640" role="presentation" focusable="false">
              <defs>
                <linearGradient id="portraitWash" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#d9f56b" stopOpacity=".92" />
                  <stop offset="1" stopColor="#96b849" stopOpacity=".35" />
                </linearGradient>
                <pattern id="portraitGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M24 0H0V24" fill="none" stroke="#f2f0ea" strokeOpacity=".14" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="520" height="640" fill="#1a1b18" />
              <rect width="520" height="640" fill="url(#portraitGrid)" />
              <circle cx="350" cy="178" r="132" fill="none" stroke="#d9f56b" strokeOpacity=".42" />
              <circle cx="350" cy="178" r="102" fill="none" stroke="#d9f56b" strokeOpacity=".22" />
              <path d="M61 528c41-111 124-165 208-165s167 54 208 165v112H61V528Z" fill="url(#portraitWash)" fillOpacity=".25" />
              <path d="M172 520c19-65 51-97 97-97s78 32 97 97" fill="none" stroke="#e8eddb" strokeOpacity=".78" strokeWidth="2" />
              <path d="M143 565c48-25 91-38 126-38s78 13 126 38" fill="none" stroke="#d9f56b" strokeOpacity=".8" strokeWidth="2" />
              <path d="M260 79v92M214 125h92" stroke="#f2f0ea" strokeOpacity=".7" strokeWidth="1" />
              <circle cx="260" cy="125" r="28" fill="none" stroke="#f2f0ea" strokeOpacity=".76" />
              <text x="40" y="75" fill="#d9f56b" fontFamily="monospace" fontSize="14" letterSpacing="3">AG / PORTRAIT</text>
              <text x="40" y="603" fill="#f2f0ea" fillOpacity=".68" fontFamily="monospace" fontSize="10" letterSpacing="2">REPLACEABLE ABSTRACT PLACEHOLDER</text>
            </svg>
            <span className="portrait__monogram">AG</span>
          </div>
        )}
        <span className="portrait__corner portrait__corner--top" aria-hidden="true" />
        <span className="portrait__corner portrait__corner--bottom" aria-hidden="true" />
      </div>
      <figcaption>
        <span>{isPersian ? 'تصویر پرتره' : 'Portrait'}</span>
        <span>{isPersian ? 'جای‌نگهدار انتزاعی · قابل جایگزینی از پنل مدیریت' : 'Abstract placeholder · replaceable from the admin panel'}</span>
      </figcaption>
    </figure>
  );
}
