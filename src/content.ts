export type Locale = 'fa' | 'en';

export interface ProjectCaseStudy {
  problem: string;
  solution: string;
  engineering: string[];
  outcome: string;
}

export interface ProjectTranslation {
  title: string;
  category: string;
  summary: string;
  description: string;
  details: string[];
  caseStudy: ProjectCaseStudy;
  seoTitle: string;
  seoDescription: string;
  note?: string;
}

export interface ProjectImage {
  id?: number;
  url: string;
  alt: string;
}

export interface Project {
  id: string;
  slug: string;
  number: string;
  accent: 'lime' | 'blue' | 'orange';
  featured: boolean;
  githubUrl: string;
  liveUrl: string;
  coverUrl: string;
  technologies: string[];
  images?: ProjectImage[];
  fa: ProjectTranslation;
  en: ProjectTranslation;
}

export interface Profile {
  name: string;
  role: string;
  greeting: string;
  statement: string;
  about: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  portraitUrl: string;
  seoTitle: string;
  seoDescription: string;
}

export interface ExpertiseItem {
  number: string;
  icon: 'brain' | 'heart' | 'code' | 'sparkles';
  title: string;
  focus: string;
  description: string;
}

export const profileByLocale: Record<Locale, Profile> = {
  fa: {
    name: 'امیرعلی غمخوار',
    role: 'مهندس هوش مصنوعی · توسعه‌دهنده نرم‌افزار',
    greeting: 'سلام، من امیرعلی هستم.',
    statement: 'مهندس هوش مصنوعی که سیستم‌های هوشمند برای سلامت، آموزش و محصولات واقعی می‌سازد.',
    about: 'من امیرعلی هستم و سیستم‌های هوش مصنوعی را از ابتدا تا انتها می‌سازم: خط لوله‌ای که صوت یا سند را به خروجی ساخت‌یافته تبدیل می‌کند، اعتبارسنجی‌ای که تعیین می‌کند خروجی مدل اجازهٔ عبور دارد یا نه، محصولی که دور آن شکل می‌گیرد و استقراری که آن را سرپا نگه می‌دارد. بیشتر کار من جایی است که زبان به محدودیت‌های واقعی می‌خورد: دیکتهٔ پزشکی فارسی و انگلیسی، جزوه و ابزارهای یادگیری برآمده از فایل‌های کلاس، و سرویس‌های کوچکی که باید رفتار قابل پیش‌بینی داشته باشند. برای من رفتار قطعی، گفتن صادقانهٔ محدودیت‌ها و سیستمی که بتوان درباره‌اش استدلال کرد اهمیت دارد.',
    email: '',
    githubUrl: 'https://github.com/AmiraliGhamkhar',
    linkedinUrl: '',
    portraitUrl: '',
    seoTitle: 'امیرعلی غمخوار — مهندس هوش مصنوعی / هوش مصنوعی پزشکی / نرم‌افزار',
    seoDescription: 'امیرعلی غمخوار، مهندس هوش مصنوعی و توسعه‌دهنده نرم‌افزار. پروژه‌های واقعی در پردازش گفتار، هوش مصنوعی پزشکی و محصولهای نرم‌افزاری، همراه با علایق پژوهشی و راه‌های ارتباط.',
  },
  en: {
    name: 'Amirali Ghamkhar',
    role: 'AI Engineer · Software Developer',
    greeting: "Hi, I'm Amirali.",
    statement: 'AI Engineer building intelligent systems for healthcare, education and real-world products.',
    about: "I'm Amirali, and I build AI systems end to end: the pipeline that turns audio or a document into something structured, the validation that decides whether a model output is allowed through, the product built around it, and the deployment that keeps it running. Most of my work sits where language meets real constraints — Persian and English medical dictation, study material generated from lecture files, and small services that have to behave predictably. I care about deterministic behaviour, stating limitations honestly, and systems I can actually reason about.",
    email: '',
    githubUrl: 'https://github.com/AmiraliGhamkhar',
    linkedinUrl: '',
    portraitUrl: '',
    seoTitle: 'Amirali Ghamkhar — AI Engineer / Medical AI / Software',
    seoDescription: 'Amirali Ghamkhar is an AI engineer and software developer. Real projects in speech processing, medical AI and production software, with research interests and contact details.',
  },
};

export const projects: Project[] = [
  {
    id: 'gamas-bot',
    slug: 'gamas-bot',
    number: '01',
    accent: 'lime',
    featured: true,
    githubUrl: 'https://github.com/AmiraliGhamkhar/Gamas_bot',
    liveUrl: '',
    coverUrl: '',
    technologies: ['Python', 'Telethon', 'SQLite', 'PyAV', 'LLM APIs'],
    fa: {
      title: 'گاماس بات',
      category: 'دستیار مطالعاتی تلگرام',
      summary: 'دستیار مطالعاتی فارسی که صوت و اسناد آموزشی را به متن، جزوه، آزمون و فلش‌کارت تبدیل می‌کند.',
      description: 'گاماس بات یک دستیار مطالعاتی تلگرام است که فایل صوتی، ویدیو، پیام صوتی و اسناد آموزشی را به جریان‌های یادگیری ساخت‌یافته وصل می‌کند؛ از متن و جزوه تا آزمون، فلش‌کارت و خروجی فایل.',
      details: [
        'ورودی صوت، ویدیو، پیام صوتی و اسناد آموزشی مانند PDF و DOCX',
        'متن‌نگاری، جزوه‌های ساخت‌یافته و ابزارهای مرور مانند آزمون و فلش‌کارت',
        'کتابخانهٔ کاربر، پشتیبانی و جریان‌های خروجی برای فایل‌های متنی و اداری',
      ],
      caseStudy: {
        problem: 'دانشجو کلاس را با گوشی ضبط می‌کند و بعد چیزی برای مطالعه ندارد: چند ساعت صوت، یا یک فایل PDF، و هیچ راه ساخت‌یافته‌ای برای مرور آن. تبدیل دستی این فایل‌ها به جزوه کند است و متن‌نگاریِ تنها چیزی تولید نمی‌کند که بشود از آن درس خواند.',
        solution: 'یک ربات تلگرام که صوت، ویدیو، پیام صوتی، PDF، DOCX و پاورپوینت می‌گیرد و مواد مطالعاتی برمی‌گرداند: متن، جزوهٔ راست‌چین Word، آزمون، فلش‌کارت و خروجی فایل. هر فایل از یک بررسی ورود، یک صف کار محدود و کتابخانهٔ کاربر عبور می‌کند تا ربات زیر بار پاسخ‌گو بماند.',
        engineering: [
          'یک کلاینت Telethon با مراحل asyncio محدود و SQLite در حالت WAL؛ کارهای رسانه با PyAV در فرایندهای فرزندِ محدود اجرا می‌شوند، پس نه به صف پیام نیاز است، نه پایگاه‌دادهٔ خارجی و نه نصب سیستمی FFmpeg.',
          'تولید جزوه از یک زنجیرهٔ مرتب از ارائه‌دهنده‌ها استفاده می‌کند: هر مسیر کلید، نشانی پایه و مدل خود را دارد، خطاهای گذرا با سقف مشخص تلاش دوباره می‌شوند و خطای قابل‌بازیابی به مسیر بعدی منتقل می‌شود.',
          'خروجی مدل به‌صورت JSON سخت‌گیرانه تجزیه می‌شود، از نظر شکل جزوه و پایبندی به منبع اعتبارسنجی می‌گردد و بعد از آن رندر می‌شود. پاسخ بریده‌شده رد می‌شود، نه اینکه به‌صورت جزوهٔ ناقص تحویل داده شود.',
          'برای یادداشت اسناد و تبدیل فایل‌های اداری، مسیرهای جایگزین قطعی وجود دارد؛ نبودِ کلید ارائه‌دهنده قابلیت را ساده‌تر می‌کند، آن را نمی‌شکند.',
          'لاگ‌ها فقط فراداده و شمار توکن دارند؛ هرگز کلید، پرامپت یا متن رونویسی در آن‌ها نیست.',
        ],
        outcome: 'یک فرایند پایتون که روی ویندوز یا هاست اشتراکی cPanel اجرا می‌شود و دور قابلیت‌های یادگیری، اعتبار و کیف پول، رسیدهای بررسی‌شده توسط مدیر، تیکت پشتیبانی و جریان معرفی دارد.',
      },
      seoTitle: 'گاماس بات — دستیار مطالعاتی تلگرام | امیرعلی غمخوار',
      seoDescription: 'مروری بر گاماس بات، دستیار مطالعاتی تلگرام برای صوت، اسناد، جزوه و ابزارهای یادگیری.',
    },
    en: {
      title: 'Gamas Bot',
      category: 'Telegram study assistant',
      summary: 'A Persian study assistant that turns audio and learning documents into transcripts, booklets, quizzes and flashcards.',
      description: 'Gamas Bot is a Telegram study assistant connecting audio, video, voice notes, and learning documents to structured study flows—from transcripts and booklets to quizzes, flashcards, and file exports.',
      details: [
        'Accepts audio, video, voice notes, and learning documents such as PDF and DOCX',
        'Supports transcripts, structured booklets, quizzes, and flashcards',
        'Includes a user library, support flows, and text and office-file exports',
      ],
      caseStudy: {
        problem: 'Students record lectures on their phones and are left with nothing to revise from: hours of audio, or a PDF, and no structured way to study it. Turning that into notes by hand is slow, and transcription on its own does not produce something worth studying.',
        solution: 'A Telegram bot that accepts audio, video, voice notes, PDFs, DOCX and PowerPoint files and returns study material: a transcript, a structured right-to-left Word booklet, quizzes, flashcards and file exports. Every file passes through an admission check, a bounded job queue and a user library, so the bot stays responsive under load.',
        engineering: [
          'One Telethon client with bounded asyncio stages and SQLite in WAL mode. Media work runs through PyAV in bounded child processes, so there is no message broker, no external database and no system FFmpeg installation.',
          'Note generation uses an ordered provider chain: each route keeps its own key, base URL and model, transient failures retry within a fixed bound, and a recoverable provider error fails over to the next route.',
          'Model output is parsed as strict JSON, validated for booklet shape and grounding before anything is rendered. A truncated completion is refused rather than delivered as a partial note.',
          'Deterministic fallbacks cover document notes and Office conversion when no note-provider key is configured, so a missing credential degrades the feature instead of breaking it.',
          'Logs carry metadata and token counts only — never keys, prompts, or transcript text.',
        ],
        outcome: 'A single Python process that runs on Windows or cPanel shared hosting, with wallet credits and admin-reviewed receipts, support tickets and a referral flow wrapped around the learning features.',
      },
      seoTitle: 'Gamas Bot — Telegram Study Assistant | Amirali Ghamkhar',
      seoDescription: 'A closer look at Gamas Bot, a Telegram study assistant for audio, documents, structured booklets, and learning tools.',
    },
  },
  {
    id: 'gamas-website',
    slug: 'gamas-website',
    number: '02',
    accent: 'blue',
    featured: true,
    githubUrl: 'https://github.com/AmiraliGhamkhar/Gamas_website',
    liveUrl: '',
    coverUrl: '',
    technologies: ['React 18', 'Vite 6', 'JavaScript', 'PHP 8.2+', 'Apache'],
    fa: {
      title: 'وب‌سایت گاماس',
      category: 'وب‌سایت محصول',
      summary: 'صفحهٔ معرفی فارسی و راست‌چین گاماس، با خروجی ایستا و یک API سبک PHP برای هاست اشتراکی.',
      description: 'وب‌سایت گاماس یک صفحهٔ معرفی فارسی و راست‌چین برای ربات آموزشی است. معماری آن HTML ایستای ازپیش‌رندرشده را با یک API کوچک PHP برای ثبت آمار کلیک ترکیب می‌کند تا روی Apache و cPanel بدون فرایند دائمی Node اجرا شود.',
      details: [
        'رابط فارسی و راست‌چین با HTML ایستای ازپیش‌رندرشده',
        'React 18، Vite 6 و vite-react-ssg در زنجیرهٔ ساخت',
        'API سبک PHP 8.2+ و راهنمای استقرار روی Apache و cPanel',
      ],
      caseStudy: {
        problem: 'ربات به یک خانهٔ عمومی نیاز داشت: یک صفحهٔ محصول فارسی و راست‌چین که روی هاست اشتراکیِ ایرانی سریع باشد؛ جایی که Node.js در دسترس نیست.',
        solution: 'یک سایت ایستا با React 18 و Vite 6 که به HTML ازپیش‌رندرشده تبدیل می‌شود، همراه با یک API کوچک PHP 8.2 برای ثبت آمار کلیک، مستقرشده روی Apache در cPanel.',
        engineering: [
          'پیش‌رندرش ایستا با vite-react-ssg: هر مسیر به‌صورت HTML واقعی منتشر می‌شود، پس محتوا و فراداده برای خزنده‌ها قابل دیدن است، بدون هیچ فرایند سمت سرور.',
          'قلم‌های وب فارسی میزبانیِ داخلی می‌شوند و تصویرها در زمان ساخت پردازش می‌گردند، تا صفحه به درخواستِ قلم یا CDN شخص ثالث وابسته نباشد.',
          'API به مجموعه‌ای محدود از مسیرها با محدودسازی نرخِ درخواست و یک نقطهٔ دریافت گزارش CSP تقلیل یافته است.',
          'قواعد Apache برای کش، فشرده‌سازی، سرایندهای امنیتی و بازگشت ایستای SPA، تا رفتار سایت روی هاست اشتراکی همان باشد که در پیش‌نمایش محلی است.',
        ],
        outcome: 'صفحه‌ای که مجموعه‌ای از فایل‌های ایستا باقی می‌ماند: زمان‌اجرایی برای نگهداری ندارد، پایگاه‌داده‌ای برای پشتیبان‌گیری ندارد و آمار آن در یک استقرار کاملاً ایستا هم کار می‌کند.',
      },
      seoTitle: 'وب‌سایت گاماس — تجربهٔ محصول ایستا | امیرعلی غمخوار',
      seoDescription: 'وب‌سایت فارسی گاماس؛ یک تجربهٔ محصول ایستا با React، Vite و API سبک PHP برای cPanel.',
    },
    en: {
      title: 'Gamas Website',
      category: 'Product website',
      summary: 'A Persian, right-to-left product site for Gamas, built as static pages with a small PHP API for shared hosting.',
      description: 'The Gamas Website is a Persian, right-to-left landing page for the study assistant. Its architecture pairs pre-rendered static HTML with a small PHP API for click analytics, so the site can run on Apache and cPanel without a persistent Node process.',
      details: [
        'Persian, right-to-left interface with pre-rendered static HTML',
        'React 18, Vite 6, and vite-react-ssg in the build pipeline',
        'A lightweight PHP 8.2+ API and deployment guidance for Apache and cPanel',
      ],
      caseStudy: {
        problem: 'The bot needed a public home: a Persian, right-to-left product page that loads fast on shared hosting where Node.js is not available.',
        solution: 'A static React 18 and Vite 6 site pre-rendered to HTML, paired with a small PHP 8.2 API for click analytics, deployed to Apache under cPanel.',
        engineering: [
          'Static pre-rendering with vite-react-ssg: every route ships as real HTML, so content and metadata are crawler-visible with no server-side process.',
          'Persian webfonts are self-hosted and images are processed at build time, so the page does not depend on third-party font or CDN requests.',
          'The API surface is reduced to an allow-listed set of endpoints with rate limiting and a CSP report collector.',
          'Apache rules handle caching, compression, security headers and a static SPA fallback, so the site behaves on shared hosting exactly as it does in local preview.',
        ],
        outcome: 'A product page that stays a set of static files: no runtime to maintain, no database to back up, and analytics that still work in a purely static deployment.',
      },
      seoTitle: 'Gamas Website — Static Product Experience | Amirali Ghamkhar',
      seoDescription: 'The Persian Gamas product website: a static React and Vite experience with a lightweight PHP API for cPanel.',
    },
  },
  {
    id: 'deepgram-fa-speech',
    slug: 'deepgram-fa-speech',
    number: '03',
    accent: 'orange',
    featured: true,
    githubUrl: 'https://github.com/AmiraliGhamkhar/deepgram-fa-speech',
    liveUrl: '',
    coverUrl: '',
    technologies: ['Python', 'Deepgram', 'FastAPI', 'Windows', 'DPAPI'],
    fa: {
      title: 'گفتار پزشکی فارسی',
      category: 'دیکتهٔ پزشکی بلادرنگ',
      summary: 'ابزار دسکتاپ ویندوز برای دیکتهٔ پزشکی فارسی و انگلیسی؛ از نشست کوتاه‌عمر تا قالب‌بندی راست‌به‌چپ و تزریق متن.',
      description: 'این پروژه یک ابزار دیکتهٔ پزشکی بلادرنگ برای ویندوز است: صدا به نشست کوتاه‌عمر Deepgram می‌رود و متن از مسیر نرمال‌سازی، پردازش اصطلاحات و قالب‌بندی دوجهته عبور می‌کند تا در پنجره‌ای که در حال استفاده است تزریق شود.',
      details: [
        'پشتیبانی از دیکتهٔ گفتاری فارسی و انگلیسی روی ویندوز',
        'توکن نشست کوتاه‌عمر از میزبان تحت کنترل صاحب سامانه؛ کلید Deepgram در برنامهٔ دسکتاپ نیست',
        'پردازش قطعی اصطلاحات و متن، همراه با قالب‌بندی فارسی و انگلیسی',
      ],
      caseStudy: {
        problem: 'پزشکی که به فارسی دیکته می‌کند، به متنی با الفبای درست نیاز دارد که مقدارها و عبارت‌های نفی در آن حفظ شود. و ابزار دیکته نباید کلید API را روی همان دستگاهی که اجرا می‌شود به جا بگذارد.',
        solution: 'یک ابزار دسکتاپ ویندوز: میکروفون ← نشست کوتاه‌عمر Deepgram ← نرمال‌سازی قطعی ← پردازش اصطلاحات پزشکی ← قالب‌بندی RTL/BiDi ← تزریق متن به هر پنجره‌ای که در فوکوس است، با یک پنجرهٔ شناورِ شروع/توقف و روکش اختیاریِ رونوشت.',
        engineering: [
          'کلید Deepgram هرگز از میزبان خارج نمی‌شود. برنامه با شناسهٔ کاربری و رازِ مخصوص دستگاه خود احراز هویت می‌کند؛ راز فقط به‌صورت یک بلوکِ محافظت‌شده با DPAPI در ویندوز ذخیره می‌شود و برنامه در برابر آن یک توکن نشستِ سی‌ثانیه‌ای می‌گیرد که فقط برای دست‌دهی WebSocket به کار می‌رود.',
          'پردازش متن قطعی است نه مدل‌محور: نرمال‌سازی یونیکُد و ارقام، محافظت از عبارت‌های عددی بالینی و عبارت‌های نفی، و سپس یک بازنویسِ تطبیقِ طولانی‌ترین بر پایهٔ FST روی اصطلاح‌نامهٔ دسته‌بندی‌شده. در مسیر رونویسی یا اصلاح، هیچ مدل زبانی دخیل نیست.',
          'تزریق متن پشت یک رابط InjectionBackend ایزوله شده است، بنابراین منطق تحویل را می‌توان بدون رابط گرافیکی ویندوز و با یک بک‌اند شبیه‌سازی آزمود؛ بک‌اند ویندوز از SendInput بومی و راهبردهای کلیپ‌بورد استفاده می‌کند.',
          'نظارتی که روی نشست است شامل بازگشت نمایی برای اتصال دوباره، نگهبانِ ضبطِ خاموش، شمارش افتِ صدا و یک میانگیر بازیابی در حافظه برای متنی است که هرگز به پنجرهٔ مقصد نرسیده است.',
          'یک لایهٔ انتزاع برای ارائه‌دهنده، Deepgram را پشت یک رابط نگه می‌دارد؛ لایه‌های پردازش و تزریق هرگز آن را وارد نمی‌کنند.',
        ],
        outcome: 'یک ابزار کمکی دیکته که دربارهٔ چیستیِ خود صریح است: قطعی، قابل ردیابی و با محدودهٔ مشخص. این یک سامانهٔ NLP بالینی یا وسیلهٔ پزشکی نیست و مخزن همین را می‌گوید.',
      },
      note: 'این پروژه ابزار کمکی دیکته است؛ سامانهٔ NLP بالینی یا وسیلهٔ پزشکی نیست.',
      seoTitle: 'گفتار پزشکی فارسی — دیکتهٔ زنده برای ویندوز | امیرعلی غمخوار',
      seoDescription: 'مروری بر ابزار دیکتهٔ پزشکی فارسی و انگلیسی با توکن نشست کوتاه‌عمر، پردازش قطعی و قالب‌بندی متن.',
    },
    en: {
      title: 'Medical STT',
      category: 'Real-time medical dictation',
      summary: 'A Windows desktop tool for Persian and English medical dictation, from a short-lived session token to right-to-left formatting and text injection.',
      description: 'This project is a real-time medical dictation aid for Windows. Audio uses a short-lived Deepgram session; the resulting text passes through normalization, terminology processing and bidirectional formatting before it is injected into whatever window is in focus.',
      details: [
        'Persian and English speech dictation on Windows',
        'Short-lived session tokens minted by a self-hosted service; the Deepgram key is not placed in the desktop application',
        'Deterministic terminology and text processing with Persian/English bidirectional formatting',
      ],
      caseStudy: {
        problem: 'A clinician dictating in Persian needs text in the right script, with dosages and negation phrases preserved. And a dictation tool must not leave an API key behind on the machine it runs on.',
        solution: 'A Windows desktop tool: microphone → short-lived Deepgram session → deterministic normalization → medical terminology processing → RTL/BiDi formatting → text injection into whatever window has focus, with a floating Start/Stop control and an optional transcript overlay.',
        engineering: [
          'The Deepgram key never leaves the operator’s host. The app authenticates with its own client id and per-device secret, stored only as a Windows DPAPI-protected blob, and receives a 30-second session token used for the WebSocket handshake.',
          'Text processing is deterministic rather than model-based: Unicode and digit normalization, protection for clinical numeric expressions and negation phrases, then a longest-match FST rewriter over a categorized terminology catalog. No language model sits in the transcription or correction path.',
          'Text injection sits behind an InjectionBackend interface, so delivery logic is testable through a dry-run backend with no Windows GUI; the Windows backend uses native SendInput and clipboard strategies.',
          'Session supervision covers exponential reconnect backoff, a silent-capture watchdog, audio drop counting, and an in-memory recovery buffer for text that never reached the target window.',
          'A provider abstraction keeps Deepgram behind one interface, so the processing and injection layers never import it.',
        ],
        outcome: 'A dictation aid that is explicit about what it is: deterministic, auditable and scoped. It is not a clinical NLP system and not a medical device, and the repository says so.',
      },
      note: 'This is a dictation aid—not a clinical NLP system or a medical device.',
      seoTitle: 'Medical STT — Real-Time Persian Dictation | Amirali Ghamkhar',
      seoDescription: 'A closer look at a Persian and English medical dictation aid with short-lived session tokens and deterministic text processing.',
    },
  },
];

export const expertiseByLocale: Record<Locale, ExpertiseItem[]> = {
  fa: [
    {
      number: '01',
      icon: 'brain',
      title: 'مهندسی هوش مصنوعی',
      focus: 'عامل‌های LLM · خط‌لوله‌های هوش مصنوعی · گفتار به متن · تولید ساخت‌یافته',
      description: 'طراحی سامانه‌هایی که در آن‌ها مدل یک جزء است: جابه‌جایی مرتب میان ارائه‌دهنده‌ها، قرارداد خروجی سخت‌گیرانه، دروازهٔ اعتبارسنجی و ردِ صریحِ خروجی ناقص.',
    },
    {
      number: '02',
      icon: 'heart',
      title: 'هوش مصنوعی پزشکی',
      focus: 'دیکتهٔ بالینی · اصطلاحات پزشکی · پردازش قطعی · بیان محدودیت‌ها',
      description: 'کار در جایی که مدل زبانی ابزار درستی نیست: پردازشِ مبتنی بر قاعدهٔ اصطلاحات، محافظت از عبارت‌های عددی و نفی، و یادداشتِ روشنِ محدوده تا یک ابزار کمکی هرگز وانمود نکند سامانهٔ بالینی است.',
    },
    {
      number: '03',
      icon: 'code',
      title: 'مهندسی نرم‌افزار',
      focus: 'Python · TypeScript · APIها · SQLite · استقرار',
      description: 'تحویل کلِ چیز: همزمانیِ محدود، نوشتنِ تراکنشی، ذخیره‌سازیِ امن برای مهاجرت، و استقرارهایی که روی هاست اشتراکی یا یک دستگاه ویندوزی بدون زیرساخت اضافه بالا می‌آیند.',
    },
    {
      number: '04',
      icon: 'sparkles',
      title: 'پژوهش و ارزیابی',
      focus: 'هوش مصنوعی سلامت · تکرارپذیری · ارزیابی · ادعای صادقانه',
      description: 'سنجیدنِ ادعاها دربارهٔ هوش مصنوعی کاربردی: خط‌لولهٔ ارزیابی، آزمون‌های جهش و پوشش، و نوشتنِ آنچه سامانه واقعاً انجام می‌دهد نه آنچه به نظر می‌رسد انجام می‌دهد.',
    },
  ],
  en: [
    {
      number: '01',
      icon: 'brain',
      title: 'AI engineering',
      focus: 'LLM applications · AI pipelines · speech-to-text · structured generation',
      description: 'Designing systems where the model is one component: ordered provider failover, strict output contracts, validation gates, and explicit refusal when a result comes back incomplete.',
    },
    {
      number: '02',
      icon: 'heart',
      title: 'Medical AI',
      focus: 'Clinical dictation · medical terminology · deterministic processing · stated limits',
      description: 'Working where a language model is the wrong tool: rule-based terminology processing, protection for numeric and negation phrases, and scope notes that stop an assistive tool from ever presenting itself as a clinical system.',
    },
    {
      number: '03',
      icon: 'code',
      title: 'Software engineering',
      focus: 'Python · TypeScript · APIs · SQLite · deployment',
      description: 'Shipping the whole thing: bounded concurrency, transactional writes, migration-safe storage, and deployments that run on shared hosting or a Windows machine without extra infrastructure.',
    },
    {
      number: '04',
      icon: 'sparkles',
      title: 'Research & evaluation',
      focus: 'Healthcare AI · reproducibility · benchmarking · honest claims',
      description: 'Testing claims about applied AI instead of repeating them: benchmark pipelines, mutation and coverage probes, and writing down what a system actually does rather than what it appears to do.',
    },
  ],
};

export const interestsByLocale: Record<Locale, string[]> = {
  fa: [
    'هوش مصنوعی',
    'هوش مصنوعی پزشکی',
    'عامل‌های هوش مصنوعی و سامانه‌های LLM',
    'بازشناسی گفتار و پردازش گفتار پزشکی',
    'پردازش قطعی و ارزیابی خروجی مدل',
    'مهندسی نرم‌افزار',
    'کارآفرینی فناورانه',
  ],
  en: [
    'Artificial intelligence',
    'Medical AI',
    'AI agents and LLM systems',
    'Speech recognition and medical speech processing',
    'Deterministic post-processing and output evaluation',
    'Software engineering',
    'Technology entrepreneurship',
  ],
};

/**
 * Pipeline views rendered as the "system figure" for each project. Every stage is
 * taken from the project's own architecture documentation or source layout — these
 * are diagrams of real systems, not illustrations.
 */
export const systemFlows: Record<string, Record<Locale, { caption: string; stages: string[]; foot: string }>> = {
  'gamas-bot': {
    fa: {
      caption: 'گاماس بات — خط‌لولهٔ صوت و سند',
      stages: [
        'دریافت از تلگرام: صوت، ویدیو، پیام صوتی، PDF، DOCX، پاورپوینت',
        'بررسی ورود و صفِ محدودشده به مالک',
        'استخراج رسانه با PyAV در فرایند فرزندِ محدود',
        'تبدیل گفتار به متن',
        'زنجیرهٔ مرتبِ تولید جزوه؛ هر مسیر کلید و مدل خود را دارد',
        'تجزیهٔ JSON سخت‌گیرانه و اعتبارسنجی شکل و پایبندی به منبع',
        'جزوهٔ راست‌چین Word، آزمون، فلش‌کارت و خروجی فایل',
      ],
      foot: 'یک فرایند پایتون · Telethon + asyncio + SQLite WAL · بدون صف پیام یا پایگاه‌دادهٔ خارجی',
    },
    en: {
      caption: 'Gamas Bot — audio and document pipeline',
      stages: [
        'Telegram intake: audio, video, voice note, PDF, DOCX, PowerPoint',
        'Admission check and owner-scoped bounded queue',
        'Media extraction with PyAV in a bounded child process',
        'Speech-to-text provider',
        'Ordered note-provider chain — each route keeps its own key and model',
        'Strict JSON parse, then booklet shape and grounding validation',
        'Right-to-left Word booklet, quizzes, flashcards and file exports',
      ],
      foot: 'One Python process · Telethon + asyncio + SQLite WAL · no broker, no external database',
    },
  },
  'gamas-website': {
    fa: {
      caption: 'وب‌سایت گاماس — خط‌لولهٔ ساخت و استقرار',
      stages: [
        'منبع React 18 و Vite 6 با چیدمان راست‌چین فارسی',
        'پیش‌رندرش ایستا با vite-react-ssg در زمان ساخت',
        'HTML ایستا همراه با قلم‌های میزبانی‌شدهٔ داخلی و تصویرهای پردازش‌شده',
        'Apache و cPanel: کش، فشرده‌سازی و سرایندهای امنیتی',
        'نقطهٔ PHP 8.2 برای ثبت آمار، با محدودسازی نرخ درخواست',
      ],
      foot: 'بدون زمان‌اجرای سمت سرور · بدون پایگاه‌داده · فقط فایل‌های ایستا',
    },
    en: {
      caption: 'Gamas Website — build and delivery pipeline',
      stages: [
        'React 18 and Vite 6 source with a Persian right-to-left layout',
        'Static pre-render with vite-react-ssg at build time',
        'Static HTML with self-hosted fonts and build-time image processing',
        'Apache and cPanel: caching, compression and security headers',
        'A PHP 8.2 analytics endpoint with rate limiting',
      ],
      foot: 'No server runtime · no database · static files only',
    },
  },
  'deepgram-fa-speech': {
    fa: {
      caption: 'گفتار پزشکی — مسیر نشست و پردازش',
      stages: [
        'میکروفون با صف صوتی محدود و ابزار دقیق',
        'رازِ محافظت‌شده با DPAPI → درخواست نشست از میزبان',
        'توکن نشست کوتاه‌عمر Deepgram روی WebSocket',
        'انباشت قطعات میانی و نهایی به یک گفته',
        'نرمال‌سازی → محافظت از عددها و نفی → بازنویس FST اصطلاحات',
        'قالب‌بندی دوجهته و تزریق به پنجرهٔ در فوکوس',
      ],
      foot: 'کلید API هرگز روی دستگاه نیست · در مسیر رونویسی و اصلاح هیچ مدل زبانی دخیل نیست',
    },
    en: {
      caption: 'Medical STT — session and processing path',
      stages: [
        'Microphone through a bounded, instrumented audio queue',
        'DPAPI-protected device secret → session request to the host',
        'Short-lived Deepgram session token over WebSocket',
        'Interim and final segments accumulated into one utterance',
        'Normalization → numeric and negation protection → FST terminology rewrite',
        'Bidirectional formatting and injection into the focused window',
      ],
      foot: 'The API key never touches the machine · no language model in the transcription path',
    },
  },
};

export const heroFlow: Record<Locale, string[]> = {
  fa: [
    'صوت، ویدیو، پیام صوتی، PDF، DOCX',
    'بررسی ورود و صفِ محدودشده',
    'تبدیل گفتار به متن',
    'تولید جزوهٔ پایبند به منبع با JSON سخت‌گیرانه',
    'متن، جزوه، آزمون، فلش‌کارت و خروجی فایل',
  ],
  en: [
    'Audio, video, voice note, PDF, DOCX',
    'Admission check and bounded queue',
    'Speech-to-text',
    'Grounded note generation with strict JSON',
    'Transcript, booklet, quizzes, flashcards, exports',
  ],
};

export const technologies = [
  { group: 'AI & speech', faGroup: 'هوش مصنوعی و گفتار', items: ['Deepgram', 'Speech-to-text', 'Medical dictation', 'LLM APIs'] },
  { group: 'Applications', faGroup: 'اپلیکیشن‌ها', items: ['React', 'TypeScript', 'JavaScript', 'Vite'] },
  { group: 'Backend & data', faGroup: 'بک‌اند و داده', items: ['Python', 'PHP', 'MySQL', 'SQLite'] },
  { group: 'Integration & infrastructure', faGroup: 'یکپارچه‌سازی و زیرساخت', items: ['Telethon', 'Apache', 'Windows', 'Linux', 'GitHub Actions'] },
];

export const labels = {
  fa: {
    nav: { work: 'کارها', about: 'درباره', research: 'پژوهش', contact: 'ارتباط' },
    hero: {
      eyebrow: 'مهندسی هوش مصنوعی · هوش مصنوعی پزشکی · نرم‌افزار',
      role: 'مهندس هوش مصنوعی / توسعه‌دهنده نرم‌افزار / پردازش گفتار پزشکی',
      body: 'خط‌لوله‌های تبدیل گفتار به متن، تولید ساخت‌یافته با دروازهٔ اعتبارسنجی، و محصول‌هایی که آدم‌ها واقعاً هر روز باز می‌کنند. از ابتدا تا انتها: سرویس‌های پایتون، ربات تلگرام، اپلیکیشن وب و استقراری که دور آن‌هاست.',
      ctaProjects: 'دیدن کارهای منتخب',
      ctaContact: 'ارتباط',
      scroll: 'ادامه در پایین',
      figureCaption: 'گاماس بات — خط‌لولهٔ صوت و سند',
      figureFoot: 'ورودی → صفِ محدود → گفتار به متن → تولیدِ پایبند به منبع → خروجی',
    },
    section: {
      work: { eyebrow: 'کارهای منتخب', title: 'سه سامانه‌ای که ساخته‌ام.' },
      about: { eyebrow: 'درباره', title: 'کسی که آن‌ها را ساخته است.' },
      capabilities: { eyebrow: 'توانمندی‌ها', title: 'کاری که بلدم انجام دهم.' },
      stack: { eyebrow: 'فناوری', title: 'ابزارها، به ترتیب مسئله.' },
      research: { eyebrow: 'پژوهش', title: 'پرسش‌هایی که دنبال می‌کنم.' },
      experience: { eyebrow: 'مسیر', title: 'تجربه و تحصیلات' },
      contact: { eyebrow: 'ارتباط', title: 'مسئله‌ای دارید که ارزش ساختن داشته باشد؟' },
    },
    about: {
      lead: 'بیشترِ کارِ من بخشِ بی‌سر و صدای هوش مصنوعی کاربردی است: ساخت‌یافته کردن، اعتبارسنجی و قابل اتکا کردن خروجی یک مدل تا بشود آن را به دست کاربر واقعی داد.',
      nowLabel: 'در حال ساخت',
      now: 'در حال حاضر: گسترشِ گاماس بات، دستیار مطالعاتی تلگرام که فایل‌های کلاس و اسناد را به متن، جزوه، آزمون و فلش‌کارت تبدیل می‌کند؛ و مستحکم‌تر کردن ابزار دیکتهٔ پزشکی فارسی و انگلیسی برای ویندوز.',
      portraitLabel: 'تصویر پرتره',
      portraitNote: 'جای‌نگهدار انتزاعی · قابل جایگزینی از پنل مدیریت',
      educationLabel: 'تحصیلات',
      educationNote: 'اطلاعات تأییدشده‌ای برای انتشار ثبت نشده است.',
      profileLabel: 'پروفایل',
      profileNote: 'این بخش با بازبینی و ویرایش مستقیم امیرعلی کامل می‌شود.',
      githubLabel: 'GitHub / AmiraliGhamkhar',
    },
    capabilities: { focusLabel: 'تمرکز' },
    stack: { note: 'فناوری‌ها بر اساس پروژه‌های مستند و پیاده‌سازیِ همین وب‌سایت فهرست شده‌اند؛ سطح مهارتِ تأییدنشده عمداً نیامده است.' },
    projects: {
      viewAll: 'همهٔ کارها',
      open: 'مشاهدهٔ مطالعهٔ موردی',
      repository: 'مخزن گیت‌هاب',
      empty: 'پروژه‌ای برای نمایش وجود ندارد.',
      problem: 'مسئله',
      solution: 'راه‌حل',
      engineering: 'مهندسی',
      outcome: 'خروجی',
      stack: 'فناوری',
      evidence: 'نمای سامانه',
      live: 'نسخهٔ زنده',
    },
    figure: { stage: 'مرحله' },
    experience: { emptyTitle: 'جزئیات تجربه هنوز منتشر نشده است.', emptyText: 'برای پرهیز از اطلاعات نادقیق، سابقهٔ شغلی و تحصیلات پس از تأیید مستقیم اضافه می‌شوند.' },
    research: { note: 'این‌ها حوزهٔ علاقه و کارند، نه ادعای انتشار یا سابقهٔ پژوهشی رسمی.' },
    contact: {
      body: 'اگر روی چیزی در هوش مصنوعی پزشکی، پردازش گفتار یا سامانه‌های هوش مصنوعی کاربردی کار می‌کنید — یا فقط می‌خواهید کد را بخوانید — بنویسید.',
      email: 'ایمیل',
      github: 'گیت‌هاب',
      name: 'نام',
      emailField: 'ایمیل شما',
      message: 'پیام',
      send: 'ارسال پیام',
      sending: 'در حال ارسال…',
      success: 'پیام شما ثبت شد. ممنون از ارتباطتان.',
      error: 'ارسال پیام انجام نشد. کمی بعد دوباره تلاش کنید.',
      namePlaceholder: 'نام شما',
      emailPlaceholder: 'name@example.com',
      messagePlaceholder: 'دربارهٔ چه چیزی صحبت کنیم؟',
      required: 'این فیلد الزامی است.',
      invalidEmail: 'نشانی ایمیل را درست وارد کنید.',
      shortMessage: 'پیام را کمی کامل‌تر بنویسید.',
      copied: 'کپی شد',
      copyEmail: 'کپی ایمیل',
      noEmail: 'نشانی ایمیل هنوز ثبت نشده است. از طریق فرم یا گیت‌هاب در ارتباط باشید.',
    },
    footer: { note: 'ساخته‌شده با کنجکاوی و دقت.', backToTop: 'بازگشت به بالا', rights: 'تمام حقوق محفوظ است.' },
    project: { back: 'بازگشت به کارها', overview: 'دربارهٔ پروژه', details: 'قابلیت‌ها', stack: 'فناوری‌های ثبت‌شده', repository: 'مشاهدهٔ مخزن', noDemo: 'پیوند نسخهٔ نمایشی ثبت نشده است.', scope: 'محدوده' },
    common: { menu: 'باز کردن فهرست', close: 'بستن', language: 'English', home: 'خانه', notFound: 'این مسیر پیدا نشد.', backHome: 'بازگشت به خانه', skip: 'رفتن به محتوای اصلی' },
  },
  en: {
    nav: { work: 'Work', about: 'About', research: 'Research', contact: 'Contact' },
    hero: {
      eyebrow: 'AI ENGINEERING · MEDICAL AI · SOFTWARE',
      role: 'AI engineering / software development / medical speech processing',
      body: 'Speech-to-text pipelines, structured generation behind validation gates, and products people actually open every day. Built end to end — Python services, Telegram bots, web apps, and the deployment around them.',
      ctaProjects: 'View selected work',
      ctaContact: 'Contact',
      scroll: 'Scroll to explore',
      figureCaption: 'Gamas Bot — audio and document pipeline',
      figureFoot: 'Input → bounded queue → speech-to-text → grounded generation → export',
    },
    section: {
      work: { eyebrow: 'Selected work', title: 'Three systems I built.' },
      about: { eyebrow: 'About', title: 'The person who built them.' },
      capabilities: { eyebrow: 'Capabilities', title: 'What I can take from problem to production.' },
      stack: { eyebrow: 'Technology', title: 'The tool follows the problem.' },
      research: { eyebrow: 'Research', title: 'Questions worth pursuing.' },
      experience: { eyebrow: 'Journey', title: 'Experience & education' },
      contact: { eyebrow: 'Contact', title: 'Have a problem worth building?' },
    },
    about: {
      lead: 'Most of my work is the unglamorous half of applied AI: making a model’s output structured, validated, and dependable enough to hand to a real user.',
      nowLabel: 'Currently building',
      now: 'Right now: extending Gamas Bot, the Telegram study assistant that turns lecture files and documents into transcripts, booklets, quizzes and flashcards — and hardening a Persian/English medical dictation tool for Windows.',
      portraitLabel: 'Portrait',
      portraitNote: 'Abstract placeholder · replaceable from the admin panel',
      educationLabel: 'Education',
      educationNote: 'No verified details have been provided for publication.',
      profileLabel: 'Profile',
      profileNote: 'This section is completed through Amirali’s direct review and edits.',
      githubLabel: 'GitHub / AmiraliGhamkhar',
    },
    capabilities: { focusLabel: 'Focus' },
    stack: { note: 'Technologies are listed from documented projects and this website’s implementation; unverified proficiency levels are intentionally omitted.' },
    projects: {
      viewAll: 'All work',
      open: 'Open case study',
      repository: 'GitHub repository',
      empty: 'There are no projects to display yet.',
      problem: 'Problem',
      solution: 'Solution',
      engineering: 'Engineering',
      outcome: 'Outcome',
      stack: 'Technology',
      evidence: 'System view',
      live: 'Live demo',
    },
    figure: { stage: 'Stage' },
    experience: { emptyTitle: 'Experience details are not published yet.', emptyText: 'To avoid inaccurate claims, work history and education will be added after direct verification.' },
    research: { note: 'These are areas of interest and practice, not claims of publications or formal research appointments.' },
    contact: {
      body: 'If you are working on something in medical AI, speech, or applied AI systems — or you just want to read the code — write to me.',
      email: 'Email',
      github: 'GitHub',
      name: 'Name',
      emailField: 'Your email',
      message: 'Message',
      send: 'Send message',
      sending: 'Sending…',
      success: 'Your message has been received. Thank you for reaching out.',
      error: 'Your message could not be sent. Please try again in a little while.',
      namePlaceholder: 'Your name',
      emailPlaceholder: 'name@example.com',
      messagePlaceholder: 'What would you like to talk about?',
      required: 'This field is required.',
      invalidEmail: 'Enter a valid email address.',
      shortMessage: 'Please write a little more.',
      copied: 'Copied',
      copyEmail: 'Copy email',
      noEmail: 'No email address has been published yet. Reach out through the form or GitHub.',
    },
    footer: { note: 'Built with curiosity and care.', backToTop: 'Back to top', rights: 'All rights reserved.' },
    project: { back: 'Back to work', overview: 'About the project', details: 'What it does', stack: 'Documented technologies', repository: 'View repository', noDemo: 'No demo link has been provided.', scope: 'Scope' },
    common: { menu: 'Open navigation', close: 'Close', language: 'فارسی', home: 'Home', notFound: 'This page could not be found.', backHome: 'Back to home', skip: 'Skip to main content' },
  },
} as const;

export const publicRoutes = [
  '/fa/', '/en/',
  '/fa/projects/', '/en/projects/',
  '/fa/contact/', '/en/contact/',
  ...projects.flatMap((project) => [`/fa/projects/${project.slug}/`, `/en/projects/${project.slug}/`]),
  '/admin/',
];

export function localeFromPath(path: string): Locale {
  return path.split('/').filter(Boolean)[0] === 'en' ? 'en' : 'fa';
}

export function projectForPath(path: string): Project | undefined {
  const match = path.match(/\/projects\/([^/]+)/);
  return match ? projects.find((project) => project.slug === match[1]) : undefined;
}
