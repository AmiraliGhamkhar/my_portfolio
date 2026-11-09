export type Locale = 'fa' | 'en';

export interface ProjectTranslation {
  title: string;
  category: string;
  summary: string;
  description: string;
  details: string[];
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
  description: string;
}

export const profileByLocale: Record<Locale, Profile> = {
  fa: {
    name: 'امیرعلی غمخوار',
    role: 'مهندس هوش مصنوعی · توسعه‌دهنده نرم‌افزار',
    greeting: 'سلام، من امیرعلی هستم.',
    statement: 'ایده‌ها را به سیستم‌های هوشمند تبدیل می‌کنم.',
    about: 'من امیرعلی‌ام؛ به ساخت نرم‌افزارهایی علاقه‌مندم که هوش مصنوعی را به ابزارهایی روشن، کاربردی و مسئولانه تبدیل می‌کنند. تمرکز من میان مهندسی هوش مصنوعی، پردازش گفتار پزشکی و طراحی سیستم‌های نرم‌افزاری قرار دارد.',
    email: '',
    githubUrl: 'https://github.com/AmiraliGhamkhar',
    linkedinUrl: '',
    portraitUrl: '',
    seoTitle: 'امیرعلی غمخوار — مهندس هوش مصنوعی و توسعه‌دهنده نرم‌افزار',
    seoDescription: 'امیرعلی غمخوار؛ ایده‌ها را به سیستم‌های هوشمند تبدیل می‌کنم. پروژه‌ها، علایق پژوهشی و راه‌های ارتباط.',
  },
  en: {
    name: 'Amirali Ghamkhar',
    role: 'AI Engineer · Software Developer',
    greeting: "Hi, I'm Amirali.",
    statement: 'Turning Ideas Into Intelligent Systems.',
    about: 'I’m Amirali, drawn to building software that turns artificial intelligence into clear, useful, and responsible tools. My interests sit across AI engineering, medical speech processing, and thoughtful software systems.',
    email: '',
    githubUrl: 'https://github.com/AmiraliGhamkhar',
    linkedinUrl: '',
    portraitUrl: '',
    seoTitle: 'Amirali Ghamkhar — AI Engineer & Software Developer',
    seoDescription: 'Amirali Ghamkhar turns ideas into intelligent systems. Explore selected projects, research interests, and ways to get in touch.',
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
    technologies: ['Python', 'Telethon', 'Telegram'],
    fa: {
      title: 'گاماس بات',
      category: 'دستیار مطالعاتی تلگرام',
      summary: 'دستیار مطالعاتی فارسی برای تبدیل صوت و اسناد آموزشی به متن، جزوه و ابزارهای یادگیری.',
      description: 'گاماس بات یک دستیار مطالعاتی تلگرام است که فایل صوتی، ویدیو، پیام صوتی و اسناد آموزشی را به جریان‌های یادگیری ساخت‌یافته وصل می‌کند؛ از متن و جزوه تا آزمون، فلش‌کارت و خروجی فایل.',
      details: [
        'ورودی صوت، ویدیو، پیام صوتی و اسناد آموزشی مانند PDF و DOCX',
        'متن‌نگاری، جزوه‌های ساخت‌یافته و ابزارهای مرور مانند آزمون و فلش‌کارت',
        'کتابخانهٔ کاربر، پشتیبانی و جریان‌های خروجی برای فایل‌های متنی و اداری',
      ],
      seoTitle: 'گاماس بات — دستیار مطالعاتی تلگرام | امیرعلی غمخوار',
      seoDescription: 'مروری بر گاماس بات، دستیار مطالعاتی تلگرام برای صوت، اسناد، جزوه و ابزارهای یادگیری.',
    },
    en: {
      title: 'Gamas Bot',
      category: 'Telegram study assistant',
      summary: 'A Persian study assistant that turns audio and learning documents into transcripts, booklets, and study tools.',
      description: 'Gamas Bot is a Telegram study assistant connecting audio, video, voice notes, and learning documents to structured study flows—from transcripts and booklets to quizzes, flashcards, and file exports.',
      details: [
        'Accepts audio, video, voice notes, and learning documents such as PDF and DOCX',
        'Supports transcripts, structured booklets, quizzes, and flashcards',
        'Includes a user library, support flows, and text and office-file exports',
      ],
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
    technologies: ['React 18', 'Vite 6', 'PHP 8.2+', 'Apache'],
    fa: {
      title: 'وب‌سایت گاماس',
      category: 'وب‌سایت محصول',
      summary: 'وب‌سایت فارسی و راست‌چین گاماس با خروجی ایستا و API سبک PHP برای میزبانی اشتراکی.',
      description: 'وب‌سایت گاماس یک صفحهٔ معرفی فارسی و راست‌چین برای ربات آموزشی است. معماری آن HTML ایستای ازپیش‌رندرشده را با یک API کوچک PHP برای ثبت آمار کلیک ترکیب می‌کند تا روی Apache و cPanel بدون فرایند دائمی Node اجرا شود.',
      details: [
        'رابط فارسی و راست‌چین با HTML ایستای ازپیش‌رندرشده',
        'React 18، Vite 6 و vite-react-ssg در زنجیرهٔ ساخت',
        'API سبک PHP 8.2+ و راهنمای استقرار روی Apache و cPanel',
      ],
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
    technologies: ['Python', 'Deepgram', 'Windows'],
    fa: {
      title: 'گفتار پزشکی فارسی',
      category: 'دیکتهٔ پزشکی بلادرنگ',
      summary: 'ابزار دسکتاپ ویندوز برای دیکتهٔ پزشکی فارسی و انگلیسی با پردازش قطعی و قالب‌بندی راست‌به‌چپ.',
      description: 'این پروژه یک ابزار دیکتهٔ پزشکی بلادرنگ برای ویندوز است: صدا به نشست کوتاه‌عمر Deepgram می‌رود و متن از مسیر نرمال‌سازی، پردازش اصطلاحات و قالب‌بندی دوجهته عبور می‌کند.',
      details: [
        'پشتیبانی از دیکتهٔ گفتاری فارسی و انگلیسی روی ویندوز',
        'توکن نشست کوتاه‌عمر از میزبان تحت کنترل صاحب سامانه؛ کلید Deepgram در برنامهٔ دسکتاپ نیست',
        'پردازش قطعی اصطلاحات و متن، همراه با قالب‌بندی فارسی و انگلیسی',
      ],
      note: 'این پروژه ابزار کمکی دیکته است؛ سامانهٔ NLP بالینی یا وسیلهٔ پزشکی نیست.',
      seoTitle: 'گفتار پزشکی فارسی — دیکتهٔ زنده برای ویندوز | امیرعلی غمخوار',
      seoDescription: 'مروری بر ابزار دیکتهٔ پزشکی فارسی و انگلیسی با توکن نشست کوتاه‌عمر، پردازش قطعی و قالب‌بندی متن.',
    },
    en: {
      title: 'Medical STT',
      category: 'Real-time medical dictation',
      summary: 'A Windows desktop tool for Persian and English medical dictation with deterministic processing and RTL formatting.',
      description: 'This project is a real-time medical dictation aid for Windows. Audio uses a short-lived Deepgram session; resulting text passes through normalization, terminology processing, and bidirectional formatting.',
      details: [
        'Persian and English speech dictation on Windows',
        'Short-lived session tokens minted by a self-hosted service; the Deepgram key is not placed in the desktop application',
        'Deterministic terminology and text processing with Persian/English bidirectional formatting',
      ],
      note: 'This is a dictation aid—not a clinical NLP system or a medical device.',
      seoTitle: 'Medical STT — Real-Time Persian Dictation | Amirali Ghamkhar',
      seoDescription: 'A closer look at a Persian and English medical dictation aid with short-lived session tokens and deterministic text processing.',
    },
  },
];

export const expertiseByLocale: Record<Locale, ExpertiseItem[]> = {
  fa: [
    { number: '01', icon: 'brain', title: 'هوش مصنوعی', description: 'طراحی سیستم‌های هوشمند، عامل‌های AI و تجربه‌های مبتنی بر مدل‌های زبانی؛ با تمرکز بر تبدیل ایده به ابزار قابل استفاده.' },
    { number: '02', icon: 'heart', title: 'هوش مصنوعی پزشکی', description: 'کاوش در پیوند هوش مصنوعی و سلامت، با توجه ویژه به کاربردپذیری، محدودیت‌ها و شفافیت در ابزارهای کمکی.' },
    { number: '03', icon: 'code', title: 'مهندسی نرم‌افزار', description: 'ساخت محصول‌های وب و نرم‌افزارهای کاربردی؛ از معماری و API تا رابط‌هایی که برای استفادهٔ واقعی طراحی شده‌اند.' },
    { number: '04', icon: 'sparkles', title: 'فناوری و کارآفرینی', description: 'تبدیل مسئله‌های واقعی به فرصت‌های محصولی و آزمودن راه‌های تازه برای ساخت فناوری مفید.' },
  ],
  en: [
    { number: '01', icon: 'brain', title: 'Artificial intelligence', description: 'Intelligent systems, AI agents, and language-model experiences—focused on turning a promising idea into a usable tool.' },
    { number: '02', icon: 'heart', title: 'Medical AI', description: 'Exploring the intersection of AI and health, with attention to practical use, clear limitations, and transparent assistive tools.' },
    { number: '03', icon: 'code', title: 'Software engineering', description: 'Building web products and useful software—from architecture and APIs to interfaces designed for real use.' },
    { number: '04', icon: 'sparkles', title: 'Technology & entrepreneurship', description: 'Turning real problems into product opportunities and testing new ways to build useful technology.' },
  ],
};

export const interestsByLocale: Record<Locale, string[]> = {
  fa: ['هوش مصنوعی', 'هوش مصنوعی پزشکی', 'عامل‌های AI و سامانه‌های LLM', 'بازشناسی گفتار و پردازش گفتار پزشکی', 'مهندسی نرم‌افزار', 'اتوماسیون', 'کارآفرینی فناورانه'],
  en: ['Artificial intelligence', 'Medical AI', 'AI agents and LLM systems', 'Speech recognition and medical speech processing', 'Software engineering', 'Automation', 'Technology entrepreneurship'],
};

export const technologies = [
  { group: 'AI & speech', faGroup: 'هوش مصنوعی و گفتار', items: ['Deepgram', 'Speech processing', 'Medical dictation'] },
  { group: 'Product & software', faGroup: 'محصول و نرم‌افزار', items: ['React', 'TypeScript', 'Vite', 'Python', 'PHP', 'MySQL'] },
  { group: 'Systems & platforms', faGroup: 'سامانه‌ها و پلتفرم‌ها', items: ['GSAP', 'Telethon', 'Telegram', 'Windows', 'Apache'] },
];

export const labels = {
  fa: {
    nav: { about: 'درباره', expertise: 'حوزه‌ها', projects: 'پروژه‌ها', experience: 'مسیر', contact: 'ارتباط' },
    hero: {
      greeting: 'سلام، من امیرعلی هستم.',
      lines: ['ایده‌ها را', 'به سیستم‌های', 'هوشمند تبدیل می‌کنم.'],
      role: 'مهندس هوش مصنوعی / توسعه‌دهنده نرم‌افزار / پژوهشگر علاقه‌مند به هوش مصنوعی پزشکی',
      ctaProjects: 'دیدن پروژه‌ها', ctaContact: 'شروع یک گفت‌وگو', scroll: 'برای کشف بیشتر اسکرول کنید',
      index: 'مستقل می‌سازم؛ با کنجکاوی و دقت.',
    },
    section: {
      about: { number: '01', eyebrow: 'کمی دربارهٔ من', title: 'ساختن، با نیت روشن.' },
      expertise: { number: '02', eyebrow: 'حوزه‌های تمرکز', title: 'کنجکاوی، در عمل.' },
      stack: { number: '03', eyebrow: 'ابزارها و فناوری', title: 'ابزار، تابع مسئله است.' },
      projects: { number: '04', eyebrow: 'پروژه‌های منتخب', title: 'ایده‌هایی در حال شکل‌گیری.' },
      experience: { number: '05', eyebrow: 'تجربه و تحصیلات', title: 'مسیر، صادقانه ثبت می‌شود.' },
      research: { number: '06', eyebrow: 'علایق پژوهشی', title: 'پرسش‌هایی که دنبال می‌کنم.' },
      contact: { number: '07', eyebrow: 'با هم بسازیم', title: 'بیایید چیزی هوشمندانه بسازیم.' },
    },
    about: {
      lead: 'فناوری وقتی معنا پیدا می‌کند که یک ایدهٔ خوب را به تجربه‌ای قابل اتکا برای آدم‌ها تبدیل کند.',
      paragraph: 'به سامانه‌هایی علاقه دارم که دقیق و قابل فهم باشند؛ جایی که مهندسی نرم‌افزار، هوش مصنوعی و نیازهای واقعی به هم می‌رسند. ترجیح می‌دهم محدودیت‌ها روشن باشند و هر ادعا پشتوانه داشته باشد.',
      portraitLabel: 'تصویر پرتره', portraitNote: 'جای‌نگهدار انتزاعی · قابل جایگزینی از پنل مدیریت',
      educationLabel: 'تحصیلات', educationNote: 'اطلاعات تأییدشده‌ای برای انتشار ثبت نشده است.',
      profileLabel: 'پروفایل', profileNote: 'محتوا با تأیید و ویرایش مستقیم امیرعلی تکمیل می‌شود.',
    },
    expertise: { more: 'حوزهٔ علاقه و ساخت' },
    stack: { note: 'فهرست فناوری‌ها بر اساس پروژه‌های مستند و پیکربندی این وب‌سایت است؛ مهارت‌ها یا سطح تخصص تأییدنشده به آن افزوده نشده‌اند.' },
    projects: { count: 'پروژه', viewAll: 'همهٔ پروژه‌ها', previous: 'پروژهٔ قبلی', next: 'پروژهٔ بعدی', open: 'مشاهدهٔ مطالعهٔ موردی', repository: 'مخزن گیت‌هاب', empty: 'پروژه‌ای برای نمایش وجود ندارد.' },
    experience: { emptyTitle: 'جزئیات تجربه هنوز منتشر نشده است.', emptyText: 'برای پرهیز از اطلاعات نادقیق، سابقهٔ شغلی و تحصیلات پس از تأیید مستقیم اضافه می‌شوند.' },
    research: { note: 'این‌ها حوزه‌های علاقه‌مندی‌اند، نه ادعای انتشار یا سابقهٔ پژوهشی.' },
    contact: { body: 'برای همکاری، پرسش یا گفت‌وگو دربارهٔ یک ایده پیام بفرستید.', email: 'ایمیل', github: 'گیت‌هاب', name: 'نام', emailField: 'ایمیل شما', message: 'پیام', send: 'ارسال پیام', sending: 'در حال ارسال…', success: 'پیام شما ثبت شد. ممنون از ارتباطتان.', error: 'ارسال پیام انجام نشد. کمی بعد دوباره تلاش کنید.', namePlaceholder: 'نام شما', emailPlaceholder: 'name@example.com', messagePlaceholder: 'دربارهٔ چه چیزی صحبت کنیم؟', required: 'این فیلد الزامی است.', copied: 'کپی شد', copyEmail: 'کپی ایمیل' },
    footer: { note: 'با کنجکاوی ساخته شده است.', backToTop: 'بازگشت به بالا', rights: 'تمام حقوق محفوظ است.' },
    project: { back: 'بازگشت به پروژه‌ها', overview: 'دربارهٔ پروژه', details: 'قابلیت‌ها', stack: 'فناوری‌های ثبت‌شده', repository: 'مشاهدهٔ مخزن', noDemo: 'پیوند نسخهٔ نمایشی ثبت نشده است.' },
    common: { menu: 'باز کردن فهرست', close: 'بستن', language: 'English', home: 'خانه', notFound: 'این مسیر پیدا نشد.', backHome: 'بازگشت به خانه', skip: 'رفتن به محتوای اصلی' },
  },
  en: {
    nav: { about: 'About', expertise: 'Focus', projects: 'Projects', experience: 'Journey', contact: 'Contact' },
    hero: {
      greeting: "Hi, I'm Amirali.",
      lines: ['Turning Ideas', 'Into Intelligent', 'Systems.'],
      role: 'AI ENGINEERING / SOFTWARE DEVELOPMENT / MEDICAL AI RESEARCH INTERESTS',
      ctaProjects: 'Explore projects', ctaContact: 'Start a conversation', scroll: 'Scroll to explore',
      index: 'Built independently, with curiosity and care.',
    },
    section: {
      about: { number: '01', eyebrow: 'A little about me', title: 'Making things with intent.' },
      expertise: { number: '02', eyebrow: 'Areas of focus', title: 'Curiosity, in practice.' },
      stack: { number: '03', eyebrow: 'Tools & technology', title: 'The tool follows the problem.' },
      projects: { number: '04', eyebrow: 'Selected projects', title: 'Ideas taking shape.' },
      experience: { number: '05', eyebrow: 'Experience & education', title: 'A path recorded honestly.' },
      research: { number: '06', eyebrow: 'Research interests', title: 'Questions worth pursuing.' },
      contact: { number: '07', eyebrow: 'Build something together', title: "Let's Build Something Intelligent." },
    },
    about: {
      lead: 'Technology becomes meaningful when a good idea turns into a dependable experience for people.',
      paragraph: 'I am interested in systems that are precise and understandable—where software engineering, artificial intelligence, and real needs meet. I would rather make limitations clear and every claim supportable.',
      portraitLabel: 'Portrait', portraitNote: 'Abstract placeholder · replaceable from the admin panel',
      educationLabel: 'Education', educationNote: 'No verified details have been provided for publication.',
      profileLabel: 'Profile', profileNote: 'This section is completed through Amirali’s direct review and edits.',
    },
    expertise: { more: 'Area of interest and practice' },
    stack: { note: 'Technologies are listed from documented projects and this website’s implementation; unverified skill levels are intentionally omitted.' },
    projects: { count: 'projects', viewAll: 'All projects', previous: 'Previous project', next: 'Next project', open: 'Open case study', repository: 'GitHub repository', empty: 'There are no projects to display yet.' },
    experience: { emptyTitle: 'Experience details are not published yet.', emptyText: 'To avoid inaccurate claims, work history and education will be added after direct verification.' },
    research: { note: 'These are areas of interest, not claims of publications or research appointments.' },
    contact: { body: 'For a collaboration, a question, or a thoughtful conversation about an idea, send a note.', email: 'Email', github: 'GitHub', name: 'Name', emailField: 'Your email', message: 'Message', send: 'Send message', sending: 'Sending…', success: 'Your message has been received. Thank you for reaching out.', error: 'Your message could not be sent. Please try again in a little while.', namePlaceholder: 'Your name', emailPlaceholder: 'name@example.com', messagePlaceholder: 'What would you like to talk about?', required: 'This field is required.', copied: 'Copied', copyEmail: 'Copy email' },
    footer: { note: 'Made with curiosity.', backToTop: 'Back to top', rights: 'All rights reserved.' },
    project: { back: 'Back to projects', overview: 'About the project', details: 'What it does', stack: 'Documented technologies', repository: 'View repository', noDemo: 'No demo link has been provided.' },
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
