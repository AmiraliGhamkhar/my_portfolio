INSERT IGNORE INTO profile (id, email, github_url, linkedin_url, portrait_url) VALUES
  (1, '', 'https://github.com/AmiraliGhamkhar', '', '');

INSERT IGNORE INTO profile_translations (profile_id, language, name, role, hero_greeting, statement, about, seo_title, seo_description) VALUES
  (1, 'fa', 'امیرعلی غمخوار', 'مهندس هوش مصنوعی · توسعه‌دهنده نرم‌افزار', 'سلام، من امیرعلی هستم.', 'ایده‌ها را به سیستم‌های هوشمند تبدیل می‌کنم.', 'من امیرعلی‌ام؛ به ساخت نرم‌افزارهایی علاقه‌مندم که هوش مصنوعی را به ابزارهایی روشن، کاربردی و مسئولانه تبدیل می‌کنند. تمرکز من میان مهندسی هوش مصنوعی، پردازش گفتار پزشکی و طراحی سیستم‌های نرم‌افزاری قرار دارد.', 'امیرعلی غمخوار — مهندس هوش مصنوعی و توسعه‌دهنده نرم‌افزار', 'امیرعلی غمخوار؛ ایده‌ها را به سیستم‌های هوشمند تبدیل می‌کنم. پروژه‌ها، علایق پژوهشی و راه‌های ارتباط.'),
  (1, 'en', 'Amirali Ghamkhar', 'AI Engineer · Software Developer', "Hi, I'm Amirali.", 'Turning Ideas Into Intelligent Systems.', 'I’m Amirali, drawn to building software that turns artificial intelligence into clear, useful, and responsible tools. My interests sit across AI engineering, medical speech processing, and thoughtful software systems.', 'Amirali Ghamkhar — AI Engineer & Software Developer', 'Amirali Ghamkhar turns ideas into intelligent systems. Explore selected projects, research interests, and ways to get in touch.');

INSERT IGNORE INTO projects (slug, status, github_url, featured, sort_order, published_at) VALUES
  ('gamas-bot', 'published', 'https://github.com/AmiraliGhamkhar/Gamas_bot', 1, 1, NULL),
  ('gamas-website', 'published', 'https://github.com/AmiraliGhamkhar/Gamas_website', 1, 2, NULL),
  ('deepgram-fa-speech', 'published', 'https://github.com/AmiraliGhamkhar/deepgram-fa-speech', 1, 3, NULL);

INSERT IGNORE INTO project_translations (project_id, language, title, category, summary, description, details_json, seo_title, seo_description)
SELECT id, 'fa', 'گاماس بات', 'دستیار مطالعاتی تلگرام', 'دستیار مطالعاتی فارسی برای تبدیل صوت و اسناد آموزشی به متن، جزوه و ابزارهای یادگیری.', 'گاماس بات یک دستیار مطالعاتی تلگرام است که فایل صوتی، ویدیو، پیام صوتی و اسناد آموزشی را به جریان‌های یادگیری ساخت‌یافته وصل می‌کند؛ از متن و جزوه تا آزمون، فلش‌کارت و خروجی فایل.', JSON_ARRAY('ورودی صوت، ویدیو، پیام صوتی و اسناد آموزشی مانند PDF و DOCX', 'متن‌نگاری، جزوه‌های ساخت‌یافته و ابزارهای مرور مانند آزمون و فلش‌کارت', 'کتابخانهٔ کاربر، پشتیبانی و جریان‌های خروجی برای فایل‌های متنی و اداری'), 'گاماس بات — دستیار مطالعاتی تلگرام | امیرعلی غمخوار', 'مروری بر گاماس بات، دستیار مطالعاتی تلگرام برای صوت، اسناد، جزوه و ابزارهای یادگیری.' FROM projects WHERE slug='gamas-bot';
INSERT IGNORE INTO project_translations (project_id, language, title, category, summary, description, details_json, seo_title, seo_description)
SELECT id, 'en', 'Gamas Bot', 'Telegram study assistant', 'A Persian study assistant that turns audio and learning documents into transcripts, booklets, and study tools.', 'Gamas Bot is a Telegram study assistant connecting audio, video, voice notes, and learning documents to structured study flows—from transcripts and booklets to quizzes, flashcards, and file exports.', JSON_ARRAY('Accepts audio, video, voice notes, and learning documents such as PDF and DOCX', 'Supports transcripts, structured booklets, quizzes, and flashcards', 'Includes a user library, support flows, and text and office-file exports'), 'Gamas Bot — Telegram Study Assistant | Amirali Ghamkhar', 'A closer look at Gamas Bot, a Telegram study assistant for audio, documents, structured booklets, and learning tools.' FROM projects WHERE slug='gamas-bot';

INSERT IGNORE INTO project_translations (project_id, language, title, category, summary, description, details_json, seo_title, seo_description)
SELECT id, 'fa', 'وب‌سایت گاماس', 'وب‌سایت محصول', 'وب‌سایت فارسی و راست‌چین گاماس با خروجی ایستا و API سبک PHP برای میزبانی اشتراکی.', 'وب‌سایت گاماس یک صفحهٔ معرفی فارسی و راست‌چین برای ربات آموزشی است. معماری آن HTML ایستای ازپیش‌رندرشده را با یک API کوچک PHP برای ثبت آمار کلیک ترکیب می‌کند تا روی Apache و cPanel بدون فرایند دائمی Node اجرا شود.', JSON_ARRAY('رابط فارسی و راست‌چین با HTML ایستای ازپیش‌رندرشده', 'React 18، Vite 6 و vite-react-ssg در زنجیرهٔ ساخت', 'API سبک PHP 8.2+ و راهنمای استقرار روی Apache و cPanel'), 'وب‌سایت گاماس — تجربهٔ محصول ایستا | امیرعلی غمخوار', 'وب‌سایت فارسی گاماس؛ یک تجربهٔ محصول ایستا با React، Vite و API سبک PHP برای cPanel.' FROM projects WHERE slug='gamas-website';
INSERT IGNORE INTO project_translations (project_id, language, title, category, summary, description, details_json, seo_title, seo_description)
SELECT id, 'en', 'Gamas Website', 'Product website', 'A Persian, right-to-left product site for Gamas, built as static pages with a small PHP API for shared hosting.', 'The Gamas Website is a Persian, right-to-left landing page for the study assistant. Its architecture pairs pre-rendered static HTML with a small PHP API for click analytics, so the site can run on Apache and cPanel without a persistent Node process.', JSON_ARRAY('Persian, right-to-left interface with pre-rendered static HTML', 'React 18, Vite 6, and vite-react-ssg in the build pipeline', 'A lightweight PHP 8.2+ API and deployment guidance for Apache and cPanel'), 'Gamas Website — Static Product Experience | Amirali Ghamkhar', 'The Persian Gamas product website: a static React and Vite experience with a lightweight PHP API for cPanel.' FROM projects WHERE slug='gamas-website';

INSERT IGNORE INTO project_translations (project_id, language, title, category, summary, description, details_json, seo_title, seo_description)
SELECT id, 'fa', 'گفتار پزشکی فارسی', 'دیکتهٔ پزشکی بلادرنگ', 'ابزار دسکتاپ ویندوز برای دیکتهٔ پزشکی فارسی و انگلیسی با پردازش قطعی و قالب‌بندی راست‌به‌چپ.', 'این پروژه یک ابزار دیکتهٔ پزشکی بلادرنگ برای ویندوز است: صدا به نشست کوتاه‌عمر Deepgram می‌رود و متن از مسیر نرمال‌سازی، پردازش اصطلاحات و قالب‌بندی دوجهته عبور می‌کند. این ابزار سامانهٔ NLP بالینی یا وسیلهٔ پزشکی نیست.', JSON_ARRAY('پشتیبانی از دیکتهٔ گفتاری فارسی و انگلیسی روی ویندوز', 'توکن نشست کوتاه‌عمر از میزبان تحت کنترل صاحب سامانه؛ کلید Deepgram در برنامهٔ دسکتاپ نیست', 'پردازش قطعی اصطلاحات و متن، همراه با قالب‌بندی فارسی و انگلیسی'), 'گفتار پزشکی فارسی — دیکتهٔ زنده برای ویندوز | امیرعلی غمخوار', 'مروری بر ابزار دیکتهٔ پزشکی فارسی و انگلیسی با توکن نشست کوتاه‌عمر، پردازش قطعی و قالب‌بندی متن.' FROM projects WHERE slug='deepgram-fa-speech';
INSERT IGNORE INTO project_translations (project_id, language, title, category, summary, description, details_json, seo_title, seo_description)
SELECT id, 'en', 'Medical STT', 'Real-time medical dictation', 'A Windows desktop tool for Persian and English medical dictation with deterministic processing and RTL formatting.', 'This project is a real-time medical dictation aid for Windows. Audio uses a short-lived Deepgram session; resulting text passes through normalization, terminology processing, and bidirectional formatting. It is not a clinical NLP system or a medical device.', JSON_ARRAY('Persian and English speech dictation on Windows', 'Short-lived session tokens minted by a self-hosted service; the Deepgram key is not placed in the desktop application', 'Deterministic terminology and text processing with Persian/English bidirectional formatting'), 'Medical STT — Real-Time Persian Dictation | Amirali Ghamkhar', 'A closer look at a Persian and English medical dictation aid with short-lived session tokens and deterministic text processing.' FROM projects WHERE slug='deepgram-fa-speech';

INSERT IGNORE INTO expertise (slug, icon, status, sort_order) VALUES
  ('artificial-intelligence', 'brain', 'published', 1),
  ('medical-ai', 'heart', 'published', 2),
  ('software-engineering', 'code', 'published', 3),
  ('technology-entrepreneurship', 'sparkles', 'published', 4);
INSERT IGNORE INTO expertise_translations (expertise_id, language, title, description)
SELECT id, 'fa', 'هوش مصنوعی', 'طراحی سیستم‌های هوشمند، عامل‌های AI و تجربه‌های مبتنی بر مدل‌های زبانی؛ با تمرکز بر تبدیل ایده به ابزار قابل استفاده.' FROM expertise WHERE slug='artificial-intelligence';
INSERT IGNORE INTO expertise_translations (expertise_id, language, title, description)
SELECT id, 'en', 'Artificial intelligence', 'Intelligent systems, AI agents, and language-model experiences—focused on turning a promising idea into a usable tool.' FROM expertise WHERE slug='artificial-intelligence';
INSERT IGNORE INTO expertise_translations (expertise_id, language, title, description)
SELECT id, 'fa', 'هوش مصنوعی پزشکی', 'کاوش در پیوند هوش مصنوعی و سلامت، با توجه ویژه به کاربردپذیری، محدودیت‌ها و شفافیت در ابزارهای کمکی.' FROM expertise WHERE slug='medical-ai';
INSERT IGNORE INTO expertise_translations (expertise_id, language, title, description)
SELECT id, 'en', 'Medical AI', 'Exploring the intersection of AI and health, with attention to practical use, clear limitations, and transparent assistive tools.' FROM expertise WHERE slug='medical-ai';
INSERT IGNORE INTO expertise_translations (expertise_id, language, title, description)
SELECT id, 'fa', 'مهندسی نرم‌افزار', 'ساخت محصول‌های وب و نرم‌افزارهای کاربردی؛ از معماری و API تا رابط‌هایی که برای استفادهٔ واقعی طراحی شده‌اند.' FROM expertise WHERE slug='software-engineering';
INSERT IGNORE INTO expertise_translations (expertise_id, language, title, description)
SELECT id, 'en', 'Software engineering', 'Building web products and useful software—from architecture and APIs to interfaces designed for real use.' FROM expertise WHERE slug='software-engineering';
INSERT IGNORE INTO expertise_translations (expertise_id, language, title, description)
SELECT id, 'fa', 'فناوری و کارآفرینی', 'تبدیل مسئله‌های واقعی به فرصت‌های محصولی و آزمودن راه‌های تازه برای ساخت فناوری مفید.' FROM expertise WHERE slug='technology-entrepreneurship';
INSERT IGNORE INTO expertise_translations (expertise_id, language, title, description)
SELECT id, 'en', 'Technology & entrepreneurship', 'Turning real problems into product opportunities and testing new ways to build useful technology.' FROM expertise WHERE slug='technology-entrepreneurship';

INSERT IGNORE INTO research (slug, status, sort_order) VALUES
  ('artificial-intelligence', 'published', 1),
  ('medical-ai', 'published', 2),
  ('ai-agents-llm-systems', 'published', 3),
  ('medical-speech-processing', 'published', 4),
  ('software-engineering', 'published', 5),
  ('automation', 'published', 6),
  ('technology-entrepreneurship', 'published', 7);
INSERT IGNORE INTO research_translations (research_id, language, title, description)
SELECT id, 'fa', CASE slug WHEN 'artificial-intelligence' THEN 'هوش مصنوعی' WHEN 'medical-ai' THEN 'هوش مصنوعی پزشکی' WHEN 'ai-agents-llm-systems' THEN 'عامل‌های هوش مصنوعی و سامانه‌های LLM' WHEN 'medical-speech-processing' THEN 'بازشناسی گفتار و پردازش گفتار پزشکی' WHEN 'software-engineering' THEN 'مهندسی نرم‌افزار' WHEN 'automation' THEN 'اتوماسیون' WHEN 'technology-entrepreneurship' THEN 'کارآفرینی فناورانه' END, '' FROM research;
INSERT IGNORE INTO research_translations (research_id, language, title, description)
SELECT id, 'en', CASE slug WHEN 'artificial-intelligence' THEN 'Artificial intelligence' WHEN 'medical-ai' THEN 'Medical AI' WHEN 'ai-agents-llm-systems' THEN 'AI agents and LLM systems' WHEN 'medical-speech-processing' THEN 'Speech recognition and medical speech processing' WHEN 'software-engineering' THEN 'Software engineering' WHEN 'automation' THEN 'Automation' WHEN 'technology-entrepreneurship' THEN 'Technology entrepreneurship' END, '' FROM research;

INSERT IGNORE INTO technologies (slug, category, status, sort_order) VALUES
  ('python', 'Software', 'published', 1),
  ('javascript', 'Software', 'published', 2),
  ('react', 'Frontend', 'published', 3),
  ('typescript', 'Frontend', 'published', 4),
  ('vite', 'Frontend', 'published', 5),
  ('gsap', 'Frontend', 'published', 6),
  ('php', 'Backend', 'published', 7),
  ('mysql', 'Backend', 'published', 8),
  ('pdo', 'Backend', 'published', 9),
  ('telethon', 'Messaging', 'published', 10),
  ('deepgram', 'Speech', 'published', 11),
  ('windows', 'Platforms', 'published', 12),
  ('apache', 'Infrastructure', 'published', 13);
INSERT IGNORE INTO technology_translations (technology_id, language, name, description)
SELECT id, 'fa', CASE slug WHEN 'python' THEN 'Python' WHEN 'javascript' THEN 'JavaScript' WHEN 'react' THEN 'React' WHEN 'typescript' THEN 'TypeScript' WHEN 'vite' THEN 'Vite' WHEN 'gsap' THEN 'GSAP' WHEN 'php' THEN 'PHP' WHEN 'mysql' THEN 'MySQL' WHEN 'pdo' THEN 'PDO' WHEN 'telethon' THEN 'Telethon' WHEN 'deepgram' THEN 'Deepgram' WHEN 'windows' THEN 'Windows' WHEN 'apache' THEN 'Apache' END, '' FROM technologies;
INSERT IGNORE INTO technology_translations (technology_id, language, name, description)
SELECT id, 'en', CASE slug WHEN 'python' THEN 'Python' WHEN 'javascript' THEN 'JavaScript' WHEN 'react' THEN 'React' WHEN 'typescript' THEN 'TypeScript' WHEN 'vite' THEN 'Vite' WHEN 'gsap' THEN 'GSAP' WHEN 'php' THEN 'PHP' WHEN 'mysql' THEN 'MySQL' WHEN 'pdo' THEN 'PDO' WHEN 'telethon' THEN 'Telethon' WHEN 'deepgram' THEN 'Deepgram' WHEN 'windows' THEN 'Windows' WHEN 'apache' THEN 'Apache' END, '' FROM technologies;

INSERT IGNORE INTO project_technologies (project_id, technology_id)
SELECT p.id, t.id FROM projects p JOIN technologies t ON
  (p.slug='gamas-bot' AND t.slug IN ('python','telethon')) OR
  (p.slug='gamas-website' AND t.slug IN ('javascript','react','vite','php','apache')) OR
  (p.slug='deepgram-fa-speech' AND t.slug IN ('python','deepgram','windows'));

INSERT IGNORE INTO site_settings (setting_key, value_json) VALUES
  ('default_locale', JSON_QUOTE('fa')),
  ('portfolio_version', JSON_QUOTE('1.0.0'));
