import { labels, type Locale } from '../content';

interface Props {
  locale: Locale;
  imageUrl?: string;
}

export function Portrait({ locale, imageUrl }: Props) {
  const isPersian = locale === 'fa';
  const caption = labels[locale].about;

  return (
    <figure className="portrait" data-reveal>
      <div className="portrait__frame">
        {imageUrl ? (
          <img className="portrait__uploaded" src={imageUrl} alt={isPersian ? 'تصویر امیرعلی غمخوار' : 'Portrait of Amirali Ghamkhar'} loading="lazy" />
        ) : (
          <div className="portrait__art" aria-hidden="true">
            <svg viewBox="0 0 400 460" role="presentation" focusable="false">
              <defs>
                <pattern id="portraitGrid" width="25" height="25" patternUnits="userSpaceOnUse">
                  <path d="M25 0H0V25" fill="none" stroke="#f2f1ea" strokeOpacity=".07" strokeWidth="1" />
                </pattern>
                <linearGradient id="portraitWash" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#d9f56b" stopOpacity=".14" />
                  <stop offset="1" stopColor="#d9f56b" stopOpacity="0" />
                </linearGradient>
              </defs>
              <rect width="400" height="460" fill="#171815" />
              <rect width="400" height="460" fill="url(#portraitGrid)" />
              <rect width="400" height="460" fill="url(#portraitWash)" />
              <circle cx="200" cy="176" r="86" fill="none" stroke="#f2f1ea" strokeOpacity=".26" strokeWidth="1" />
              <path d="M78 460c14-72 60-108 122-108s108 36 122 108" fill="none" stroke="#f2f1ea" strokeOpacity=".26" strokeWidth="1" />
              <path d="M0 336h400" stroke="#d9f56b" strokeOpacity=".5" strokeWidth="1" />
              <text x="34" y="424" fill="#f2f1ea" fillOpacity=".82" fontFamily="ui-monospace, monospace" fontSize="26" letterSpacing="8">AG</text>
            </svg>
          </div>
        )}
      </div>
      <figcaption>
        <span>{caption.portraitLabel}</span>
        <span>{caption.portraitNote}</span>
      </figcaption>
    </figure>
  );
}
