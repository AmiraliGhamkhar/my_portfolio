import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowLeft, ArrowRight, BadgeCheck, BookOpen, BrainCircuit, BriefcaseBusiness, Check, ChevronDown,
  Code2, FileText, FolderKanban, FlaskConical, GraduationCap, Images, LayoutDashboard, Link2,
  LoaderCircle, LockKeyhole, LogOut, Mail, Menu, Plus, Search, Settings2, ShieldCheck, Trash2,
  Upload, UserRound, X,
} from 'lucide-react';
import { ApiError, apiRequest } from '../../lib/api';

type AdminLocale = 'fa' | 'en';
type ModuleId = 'dashboard' | 'profile' | 'projects' | 'expertise' | 'technologies' | 'experience' | 'education' | 'research' | 'publications' | 'achievements' | 'messages' | 'social-links' | 'media' | 'settings' | 'security';
type AnyRecord = Record<string, any>;
type TranslationMap = { fa: AnyRecord; en: AnyRecord };

interface AdminUser { id: number; email: string; display_name: string; }
interface FieldDefinition { key: string; label: Record<AdminLocale, string>; type?: 'text' | 'textarea' | 'url' | 'number' | 'select' | 'checkbox' | 'list' | 'email' | 'password'; options?: Array<{ value: string; label: Record<AdminLocale, string> }>; hint?: Record<AdminLocale, string>; required?: boolean; }
interface ResourceDefinition { label: Record<AdminLocale, string>; singular: Record<AdminLocale, string>; base: FieldDefinition[]; translation: FieldDefinition[]; titleField: string; }

const ui = {
  fa: {
    signIn: 'ورود به پنل مدیریت', signInHint: 'برای ادامه، با حساب مدیر وارد شوید.', email: 'ایمیل مدیر', password: 'گذرواژه', signInAction: 'ورود امن', signingIn: 'در حال ورود…',
    apiUnavailable: 'ارتباط با API برقرار نشد. تنظیم PHP و پایگاه‌داده را بررسی کنید.', loginFailed: 'ایمیل یا گذرواژه صحیح نیست؛ دوباره تلاش کنید.',
    dashboard: 'نمای کلی', profile: 'پروفایل و معرفی', projects: 'پروژه‌ها', expertise: 'حوزه‌های تخصصی', technologies: 'فناوری‌ها', experience: 'تجربه', education: 'تحصیلات', research: 'پژوهش', publications: 'انتشارات', achievements: 'دستاوردها', messages: 'پیام‌ها', social: 'پیوندهای اجتماعی', media: 'کتابخانهٔ رسانه', settings: 'تنظیمات و سئو', security: 'حساب و امنیت',
    logout: 'خروج', search: 'جست‌وجو…', new: 'افزودن', edit: 'ویرایش', delete: 'حذف', save: 'ذخیره', saving: 'در حال ذخیره…', cancel: 'لغو', noItems: 'هنوز موردی ثبت نشده است.', noResults: 'موردی با این جست‌وجو پیدا نشد.', confirmDelete: 'برای حذف این مورد مطمئن هستید؟ این کار قابل بازگشت نیست.', saved: 'تغییرات ذخیره شد.', deleted: 'مورد حذف شد.', publish: 'وضعیت انتشار', draft: 'پیش‌نویس', published: 'منتشرشده', visible: 'نمایش', hidden: 'پنهان', order: 'ترتیب نمایش', language: 'زبان ویرایش', fa: 'فارسی', en: 'English',
    count: 'تعداد', unread: 'پیام‌های خوانده‌نشده', recent: 'پیام‌های تازه', open: 'باز کردن', markRead: 'خوانده شد', archive: 'بایگانی', message: 'متن پیام', sentAt: 'زمان دریافت', from: 'از',
    upload: 'بارگذاری تصویر', uploading: 'در حال بارگذاری…', uploadHint: 'JPEG، PNG، WebP یا AVIF · حداکثر ۶ مگابایت', chooseFile: 'انتخاب تصویر', noMedia: 'هنوز تصویری بارگذاری نشده است.', copyUrl: 'کپی نشانی', imageAlt: 'متن جایگزین تصویر', gallery: 'گالری پروژه', addImage: 'افزودن تصویر به گالری', chooseMedia: 'انتخاب رسانه', noGallery: 'تصویری در گالری نیست.',
    profileSaved: 'پروفایل ذخیره شد.', greeting: 'سلام و معرفی', statement: 'عنوان اصلی', role: 'عنوان حرفه‌ای', about: 'درباره', name: 'نام', emailContact: 'ایمیل عمومی', github: 'نشانی گیت‌هاب', linkedin: 'نشانی لینکدین', portrait: 'نشانی تصویر پرتره', portraitMedia: 'شناسهٔ رسانهٔ پرتره',
    passwordCurrent: 'گذرواژهٔ فعلی', passwordNew: 'گذرواژهٔ جدید', passwordConfirm: 'تکرار گذرواژهٔ جدید', updatePassword: 'به‌روزرسانی گذرواژه', passwordChanged: 'گذرواژه تغییر کرد.', passwordMismatch: 'گذرواژه‌های جدید یکسان نیستند.', passwordRule: 'حداقل ۱۲ نویسه و حداکثر ۷۲ بایت UTF-8 انتخاب کنید.',
    settingsTitle: 'تنظیمات عمومی', settingKey: 'کلید تنظیم', settingValue: 'مقدار', addSetting: 'افزودن تنظیم', saveSettings: 'ذخیره تنظیمات', defaultLocale: 'زبان پیش‌فرض', seoTitle: 'عنوان سئو', seoDescription: 'توضیحات سئو',
    unavailable: 'خدمت مدیریت فعلاً در دسترس نیست.', loading: 'در حال بارگذاری…', admin: 'مدیریت محتوا', site: 'وب‌سایت', menu: 'باز کردن منو', close: 'بستن', online: 'اتصال امن', recordId: 'شناسه', status: 'وضعیت', categories: 'دسته', details: 'جزئیات / هر خط یک مورد', technologiesField: 'شناسهٔ فناوری‌ها، با ویرگول جدا شود', slug: 'نامک (لاتین)', icon: 'شناسهٔ آیکون', cover: 'نشانی تصویر کاور', githubUrl: 'پیوند GitHub', liveUrl: 'دموی زنده', videoUrl: 'ویدیو', featured: 'پروژهٔ منتخب', startDate: 'از', endDate: 'تا', organization: 'سازمان / مؤسسه', institution: 'دانشگاه / مؤسسه', location: 'مکان', kind: 'نوع', issuer: 'صادرکننده', issuerUrl: 'پیوند صادرکننده', awardedAt: 'تاریخ', doi: 'DOI', abstract: 'چکیده', authors: 'نویسندگان', venue: 'نشریه / رویداد', url: 'نشانی پیوند', platform: 'پلتفرم', label: 'عنوان نمایشی', visibleOnSite: 'نمایش در وب‌سایت', categoryKey: 'کلید دسته', publishedAt: 'زمان انتشار', chooseLanguage: 'انتخاب زبان پنل', saveError: 'ذخیره انجام نشد. داده‌ها را بررسی کنید و دوباره تلاش کنید.',
  },
  en: {
    signIn: 'Sign in to the CMS', signInHint: 'Use the administrator account to continue.', email: 'Administrator email', password: 'Password', signInAction: 'Sign in securely', signingIn: 'Signing in…',
    apiUnavailable: 'The API could not be reached. Check the PHP and database configuration.', loginFailed: 'The email or password is incorrect. Try again.',
    dashboard: 'Overview', profile: 'Profile & hero', projects: 'Projects', expertise: 'Expertise', technologies: 'Technologies', experience: 'Experience', education: 'Education', research: 'Research', publications: 'Publications', achievements: 'Achievements', messages: 'Messages', social: 'Social links', media: 'Media library', settings: 'Settings & SEO', security: 'Account & security',
    logout: 'Sign out', search: 'Search…', new: 'Add new', edit: 'Edit', delete: 'Delete', save: 'Save changes', saving: 'Saving…', cancel: 'Cancel', noItems: 'Nothing has been added yet.', noResults: 'No results match this search.', confirmDelete: 'Delete this item? This action cannot be undone.', saved: 'Changes saved.', deleted: 'Item deleted.', publish: 'Publication status', draft: 'Draft', published: 'Published', visible: 'Visible', hidden: 'Hidden', order: 'Display order', language: 'Editing language', fa: 'فارسی', en: 'English',
    count: 'Total', unread: 'Unread messages', recent: 'Recent messages', open: 'Open', markRead: 'Mark read', archive: 'Archive', message: 'Message', sentAt: 'Received', from: 'From',
    upload: 'Upload image', uploading: 'Uploading…', uploadHint: 'JPEG, PNG, WebP, or AVIF · up to 6 MB', chooseFile: 'Choose image', noMedia: 'No images uploaded yet.', copyUrl: 'Copy URL', imageAlt: 'Image alternative text', gallery: 'Project gallery', addImage: 'Add image to gallery', chooseMedia: 'Choose media', noGallery: 'No gallery images yet.',
    profileSaved: 'Profile saved.', greeting: 'Greeting', statement: 'Main statement', role: 'Professional title', about: 'About', name: 'Name', emailContact: 'Public email', github: 'GitHub URL', linkedin: 'LinkedIn URL', portrait: 'Portrait URL', portraitMedia: 'Portrait media ID',
    passwordCurrent: 'Current password', passwordNew: 'New password', passwordConfirm: 'Confirm new password', updatePassword: 'Update password', passwordChanged: 'Password updated.', passwordMismatch: 'The new passwords do not match.', passwordRule: 'Choose at least 12 characters, using no more than 72 UTF-8 bytes.',
    settingsTitle: 'General settings', settingKey: 'Setting key', settingValue: 'Value', addSetting: 'Add setting', saveSettings: 'Save settings', defaultLocale: 'Default language', seoTitle: 'SEO title', seoDescription: 'SEO description',
    unavailable: 'The admin service is currently unavailable.', loading: 'Loading…', admin: 'Content management', site: 'Website', menu: 'Open menu', close: 'Close', online: 'Secure session', recordId: 'ID', status: 'Status', categories: 'Category', details: 'Details / one per line', technologiesField: 'Technology slugs, comma-separated', slug: 'Slug (lowercase)', icon: 'Icon key', cover: 'Cover image URL', githubUrl: 'GitHub URL', liveUrl: 'Live demo', videoUrl: 'Video URL', featured: 'Featured project', startDate: 'From', endDate: 'To', organization: 'Organization', institution: 'Institution', location: 'Location', kind: 'Type', issuer: 'Issuer', issuerUrl: 'Issuer URL', awardedAt: 'Date', doi: 'DOI', abstract: 'Abstract', authors: 'Authors', venue: 'Venue / event', url: 'URL', platform: 'Platform', label: 'Display label', visibleOnSite: 'Visible on website', categoryKey: 'Category key', publishedAt: 'Publication date', chooseLanguage: 'Admin language', saveError: 'Could not save. Check the fields and try again.',
  },
} as const;

const resourceDefinitions: Partial<Record<ModuleId, ResourceDefinition>> = {
  projects: {
    label: { fa: 'پروژه‌ها', en: 'Projects' }, singular: { fa: 'پروژه', en: 'project' }, titleField: 'title',
    base: [
      { key: 'slug', label: { fa: 'نامک', en: 'Slug' }, required: true },
      { key: 'status', label: { fa: 'وضعیت انتشار', en: 'Publication status' }, type: 'select', options: [{ value: 'draft', label: { fa: 'پیش‌نویس', en: 'Draft' } }, { value: 'published', label: { fa: 'منتشرشده', en: 'Published' } }] },
      { key: 'category_key', label: { fa: 'کلید دسته', en: 'Category key' } },
      { key: 'cover_url', label: { fa: 'نشانی تصویر کاور', en: 'Cover image URL' }, type: 'text', hint: { fa: 'می‌توانید نشانی /uploads/ یا پیوند کامل را وارد کنید.', en: 'Use an /uploads/ path or a full image URL.' } },
      { key: 'cover_media_id', label: { fa: 'شناسهٔ رسانهٔ کاور', en: 'Cover media ID' }, type: 'number', hint: { fa: 'ابتدا تصویر را در کتابخانه بارگذاری کنید.', en: 'Upload an image in the media library first.' } },
      { key: 'github_url', label: { fa: 'پیوند GitHub', en: 'GitHub URL' }, type: 'url' },
      { key: 'live_url', label: { fa: 'دموی زنده', en: 'Live demo' }, type: 'url' },
      { key: 'video_url', label: { fa: 'پیوند ویدیو', en: 'Video URL' }, type: 'url' },
      { key: 'featured', label: { fa: 'پروژهٔ منتخب', en: 'Featured project' }, type: 'checkbox' },
      { key: 'sort_order', label: { fa: 'ترتیب نمایش', en: 'Display order' }, type: 'number' },
      { key: 'published_at', label: { fa: 'تاریخ انتشار', en: 'Publication date' }, type: 'text' },
      { key: 'technologies', label: { fa: 'نامک فناوری‌ها', en: 'Technology slugs' }, type: 'text', hint: { fa: 'با ویرگول جدا کنید؛ برای نمونه: python,react', en: 'Comma-separated, e.g. python,react' } },
    ],
    translation: [
      { key: 'title', label: { fa: 'عنوان', en: 'Title' }, required: true },
      { key: 'category', label: { fa: 'دسته‌بندی', en: 'Category' } },
      { key: 'summary', label: { fa: 'خلاصه', en: 'Summary' }, type: 'textarea' },
      { key: 'description', label: { fa: 'توضیحات مطالعهٔ موردی', en: 'Case study description' }, type: 'textarea' },
      { key: 'details', label: { fa: 'قابلیت‌ها / هر خط یک مورد', en: 'Capabilities / one per line' }, type: 'list' },
      { key: 'problem', label: { fa: 'مسئله', en: 'Problem' }, type: 'textarea' },
      { key: 'solution', label: { fa: 'راه‌حل', en: 'Solution' }, type: 'textarea' },
      { key: 'engineering', label: { fa: 'نکته‌های مهندسی / هر خط یک مورد', en: 'Engineering notes / one per line' }, type: 'list' },
      { key: 'outcome', label: { fa: 'خروجی', en: 'Outcome' }, type: 'textarea' },
      { key: 'seo_title', label: { fa: 'عنوان سئو', en: 'SEO title' } },
      { key: 'seo_description', label: { fa: 'توضیحات سئو', en: 'SEO description' }, type: 'textarea' },
    ],
  },
  expertise: {
    label: { fa: 'حوزه‌های تخصصی', en: 'Expertise' }, singular: { fa: 'حوزه', en: 'expertise item' }, titleField: 'title',
    base: [
      { key: 'slug', label: { fa: 'نامک', en: 'Slug' }, required: true },
      { key: 'icon', label: { fa: 'شناسهٔ آیکون', en: 'Icon key' } },
      { key: 'status', label: { fa: 'وضعیت انتشار', en: 'Publication status' }, type: 'select', options: [{ value: 'draft', label: { fa: 'پیش‌نویس', en: 'Draft' } }, { value: 'published', label: { fa: 'منتشرشده', en: 'Published' } }] },
      { key: 'sort_order', label: { fa: 'ترتیب نمایش', en: 'Display order' }, type: 'number' },
    ],
    translation: [{ key: 'title', label: { fa: 'عنوان', en: 'Title' }, required: true }, { key: 'focus', label: { fa: 'خط تمرکز', en: 'Focus line' } }, { key: 'description', label: { fa: 'توضیحات', en: 'Description' }, type: 'textarea' }],
  },
  technologies: {
    label: { fa: 'فناوری‌ها', en: 'Technologies' }, singular: { fa: 'فناوری', en: 'technology' }, titleField: 'name',
    base: [
      { key: 'slug', label: { fa: 'نامک لاتین', en: 'Technology slug' }, required: true },
      { key: 'category', label: { fa: 'دسته', en: 'Category' } },
      { key: 'status', label: { fa: 'وضعیت انتشار', en: 'Publication status' }, type: 'select', options: [{ value: 'draft', label: { fa: 'پیش‌نویس', en: 'Draft' } }, { value: 'published', label: { fa: 'منتشرشده', en: 'Published' } }] },
      { key: 'sort_order', label: { fa: 'ترتیب نمایش', en: 'Display order' }, type: 'number' },
    ],
    translation: [{ key: 'name', label: { fa: 'نام نمایشی', en: 'Display name' }, required: true }, { key: 'description', label: { fa: 'توضیحات', en: 'Description' }, type: 'textarea' }],
  },
  experience: {
    label: { fa: 'تجربه', en: 'Experience' }, singular: { fa: 'تجربه', en: 'experience item' }, titleField: 'title',
    base: [
      { key: 'start_date', label: { fa: 'از', en: 'From' } }, { key: 'end_date', label: { fa: 'تا', en: 'To' } },
      { key: 'status', label: { fa: 'وضعیت انتشار', en: 'Publication status' }, type: 'select', options: [{ value: 'draft', label: { fa: 'پیش‌نویس', en: 'Draft' } }, { value: 'published', label: { fa: 'منتشرشده', en: 'Published' } }] },
      { key: 'sort_order', label: { fa: 'ترتیب نمایش', en: 'Display order' }, type: 'number' },
    ],
    translation: [{ key: 'title', label: { fa: 'عنوان نقش', en: 'Role / title' }, required: true }, { key: 'organization', label: { fa: 'سازمان', en: 'Organization' } }, { key: 'location', label: { fa: 'مکان', en: 'Location' } }, { key: 'description', label: { fa: 'توضیحات', en: 'Description' }, type: 'textarea' }],
  },
  education: {
    label: { fa: 'تحصیلات', en: 'Education' }, singular: { fa: 'تحصیلات', en: 'education item' }, titleField: 'title',
    base: [
      { key: 'start_date', label: { fa: 'از', en: 'From' } }, { key: 'end_date', label: { fa: 'تا', en: 'To' } },
      { key: 'status', label: { fa: 'وضعیت انتشار', en: 'Publication status' }, type: 'select', options: [{ value: 'draft', label: { fa: 'پیش‌نویس', en: 'Draft' } }, { value: 'published', label: { fa: 'منتشرشده', en: 'Published' } }] },
      { key: 'sort_order', label: { fa: 'ترتیب نمایش', en: 'Display order' }, type: 'number' },
    ],
    translation: [{ key: 'title', label: { fa: 'عنوان مدرک', en: 'Qualification' }, required: true }, { key: 'institution', label: { fa: 'دانشگاه / مؤسسه', en: 'Institution' } }, { key: 'location', label: { fa: 'مکان', en: 'Location' } }, { key: 'description', label: { fa: 'توضیحات', en: 'Description' }, type: 'textarea' }],
  },
  research: {
    label: { fa: 'پژوهش', en: 'Research' }, singular: { fa: 'موضوع پژوهش', en: 'research topic' }, titleField: 'title',
    base: [
      { key: 'slug', label: { fa: 'نامک', en: 'Slug' }, required: true },
      { key: 'status', label: { fa: 'وضعیت انتشار', en: 'Publication status' }, type: 'select', options: [{ value: 'draft', label: { fa: 'پیش‌نویس', en: 'Draft' } }, { value: 'published', label: { fa: 'منتشرشده', en: 'Published' } }] },
      { key: 'sort_order', label: { fa: 'ترتیب نمایش', en: 'Display order' }, type: 'number' },
    ],
    translation: [{ key: 'title', label: { fa: 'عنوان', en: 'Title' }, required: true }, { key: 'description', label: { fa: 'توضیحات', en: 'Description' }, type: 'textarea' }],
  },
  publications: {
    label: { fa: 'انتشارات', en: 'Publications' }, singular: { fa: 'انتشار', en: 'publication' }, titleField: 'title',
    base: [
      { key: 'doi', label: { fa: 'DOI', en: 'DOI' } }, { key: 'url', label: { fa: 'نشانی', en: 'URL' }, type: 'url' }, { key: 'published_at', label: { fa: 'تاریخ انتشار', en: 'Publication date' } },
      { key: 'status', label: { fa: 'وضعیت انتشار', en: 'Publication status' }, type: 'select', options: [{ value: 'draft', label: { fa: 'پیش‌نویس', en: 'Draft' } }, { value: 'published', label: { fa: 'منتشرشده', en: 'Published' } }] },
      { key: 'sort_order', label: { fa: 'ترتیب نمایش', en: 'Display order' }, type: 'number' },
    ],
    translation: [{ key: 'title', label: { fa: 'عنوان', en: 'Title' }, required: true }, { key: 'abstract', label: { fa: 'چکیده', en: 'Abstract' }, type: 'textarea' }, { key: 'authors', label: { fa: 'نویسندگان', en: 'Authors' }, type: 'textarea' }, { key: 'venue', label: { fa: 'نشریه / رویداد', en: 'Venue / event' } }, { key: 'seo_title', label: { fa: 'عنوان سئو', en: 'SEO title' } }, { key: 'seo_description', label: { fa: 'توضیحات سئو', en: 'SEO description' }, type: 'textarea' }],
  },
  achievements: {
    label: { fa: 'دستاوردها', en: 'Achievements' }, singular: { fa: 'دستاورد', en: 'achievement' }, titleField: 'title',
    base: [
      { key: 'kind', label: { fa: 'نوع', en: 'Type' } }, { key: 'issuer_url', label: { fa: 'پیوند صادرکننده', en: 'Issuer URL' }, type: 'url' }, { key: 'awarded_at', label: { fa: 'تاریخ', en: 'Date' } },
      { key: 'status', label: { fa: 'وضعیت انتشار', en: 'Publication status' }, type: 'select', options: [{ value: 'draft', label: { fa: 'پیش‌نویس', en: 'Draft' } }, { value: 'published', label: { fa: 'منتشرشده', en: 'Published' } }] },
      { key: 'sort_order', label: { fa: 'ترتیب نمایش', en: 'Display order' }, type: 'number' },
    ],
    translation: [{ key: 'title', label: { fa: 'عنوان', en: 'Title' }, required: true }, { key: 'issuer', label: { fa: 'صادرکننده', en: 'Issuer' } }, { key: 'description', label: { fa: 'توضیحات', en: 'Description' }, type: 'textarea' }],
  },
  'social-links': {
    label: { fa: 'پیوندهای اجتماعی', en: 'Social links' }, singular: { fa: 'پیوند اجتماعی', en: 'social link' }, titleField: 'label',
    base: [{ key: 'platform', label: { fa: 'پلتفرم', en: 'Platform' }, required: true }, { key: 'url', label: { fa: 'نشانی پیوند', en: 'URL' }, type: 'url', required: true }, { key: 'is_visible', label: { fa: 'نمایش در وب‌سایت', en: 'Visible on website' }, type: 'checkbox' }, { key: 'sort_order', label: { fa: 'ترتیب نمایش', en: 'Display order' }, type: 'number' }],
    translation: [{ key: 'label', label: { fa: 'عنوان نمایشی', en: 'Display label' }, required: true }],
  },
};

const moduleLabels: Record<ModuleId, keyof typeof ui.fa> = {
  dashboard: 'dashboard', profile: 'profile', projects: 'projects', expertise: 'expertise', technologies: 'technologies', experience: 'experience', education: 'education', research: 'research', publications: 'publications', achievements: 'achievements', messages: 'messages', 'social-links': 'social', media: 'media', settings: 'settings', security: 'security',
};

const modules: Array<{ id: ModuleId; icon: typeof LayoutDashboard; group: 'main' | 'content' | 'system' }> = [
  { id: 'dashboard', icon: LayoutDashboard, group: 'main' },
  { id: 'profile', icon: UserRound, group: 'content' },
  { id: 'projects', icon: FolderKanban, group: 'content' },
  { id: 'expertise', icon: BrainCircuit, group: 'content' },
  { id: 'technologies', icon: Code2, group: 'content' },
  { id: 'experience', icon: BriefcaseBusiness, group: 'content' },
  { id: 'education', icon: GraduationCap, group: 'content' },
  { id: 'research', icon: FlaskConical, group: 'content' },
  { id: 'publications', icon: BookOpen, group: 'content' },
  { id: 'achievements', icon: BadgeCheck, group: 'content' },
  { id: 'messages', icon: Mail, group: 'system' },
  { id: 'social-links', icon: Link2, group: 'system' },
  { id: 'media', icon: Images, group: 'system' },
  { id: 'settings', icon: Settings2, group: 'system' },
  { id: 'security', icon: ShieldCheck, group: 'system' },
];

function useAdminText(locale: AdminLocale) { return ui[locale]; }
function blankTranslations(): TranslationMap { return { fa: {}, en: {} }; }
function localizedLabel(record: AnyRecord, locale: AdminLocale, titleField: string) {
  const translation = record.translations?.[locale] ?? {};
  const alternate = record.translations?.[locale === 'fa' ? 'en' : 'fa'] ?? {};
  return translation[titleField] || alternate[titleField] || record.slug || record.platform || record.id || '';
}
function messageFromError(error: unknown, locale: AdminLocale) {
  if (error instanceof ApiError && error.status === 401) return ui[locale].loginFailed;
  return ui[locale].saveError;
}

export function AdminApp() {
  const [locale, setLocale] = useState<AdminLocale>('fa');
  const [phase, setPhase] = useState<'loading' | 'signed-out' | 'signed-in' | 'unavailable'>('signed-out');
  const [user, setUser] = useState<AdminUser | null>(null);
  const [csrf, setCsrf] = useState('');
  const [module, setModule] = useState<ModuleId>('dashboard');
  const [mobileNav, setMobileNav] = useState(false);
  const [notice, setNotice] = useState<{ text: string; kind: 'success' | 'error' } | null>(null);
  const t = useAdminText(locale);

  useEffect(() => {
    const stored = window.localStorage.getItem('ag-admin-locale');
    if (stored === 'fa' || stored === 'en') setLocale(stored);
    let active = true;
    setPhase('loading');
    apiRequest<{ user: AdminUser; csrf_token: string }>('/api/v1/admin/me')
      .then((result) => { if (active) { setUser(result.user); setCsrf(result.csrf_token); setPhase('signed-in'); } })
      .catch((error: unknown) => { if (active) setPhase(error instanceof ApiError && error.status === 401 ? 'signed-out' : 'unavailable'); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr';
    document.title = locale === 'fa' ? 'مدیریت وب‌سایت — امیرعلی غمخوار' : 'Portfolio CMS — Amirali Ghamkhar';
  }, [locale]);

  const toggleLocale = () => {
    const next = locale === 'fa' ? 'en' : 'fa';
    setLocale(next);
    window.localStorage.setItem('ag-admin-locale', next);
  };
  const notify = useCallback((text: string, kind: 'success' | 'error' = 'success') => {
    setNotice({ text, kind });
    window.setTimeout(() => setNotice(null), 3600);
  }, []);

  const onLogin = async (email: string, password: string) => {
    try {
      const token = await apiRequest<{ csrf_token: string }>('/api/v1/admin/csrf');
      const result = await apiRequest<{ user: AdminUser; csrf_token: string }>('/api/v1/admin/login', { method: 'POST', headers: { 'X-CSRF-Token': token.csrf_token }, body: JSON.stringify({ email, password }) });
      setUser(result.user); setCsrf(result.csrf_token); setPhase('signed-in');
    } catch (error) {
      if (error instanceof ApiError && error.status !== 401) setPhase('signed-out');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiRequest('/api/v1/admin/logout', { method: 'POST', headers: { 'X-CSRF-Token': csrf }, body: '{}' });
      setUser(null); setCsrf(''); setPhase('signed-out'); setModule('dashboard');
    } catch (error) { notify(messageFromError(error, locale), 'error'); }
  };

  if (phase === 'loading') return <div className="admin-state" dir={locale === 'fa' ? 'rtl' : 'ltr'}><LoaderCircle className="spin" size={25} /><span>{t.loading}</span></div>;
  if (phase !== 'signed-in' || !user) return <LoginScreen locale={locale} onLogin={onLogin} unavailable={phase === 'unavailable'} onLocale={toggleLocale} />;

  const activeModule = modules.find((item) => item.id === module)!;
  const ActiveIcon = activeModule.icon;
  const title = t[moduleLabels[module]];
  return (
    <div className={`admin-shell admin-shell--${locale}`} dir={locale === 'fa' ? 'rtl' : 'ltr'} lang={locale}>
      {mobileNav ? <button className="admin-scrim" aria-label={t.close} onClick={() => setMobileNav(false)} /> : null}
      <aside className={`admin-sidebar ${mobileNav ? 'is-open' : ''}`}>
        <div className="admin-sidebar__brand"><span className="admin-mark">AG<span>.</span></span><span><b>{t.admin}</b><small>AMIRALI GHAMKHAR</small></span><button className="admin-close-menu" onClick={() => setMobileNav(false)} aria-label={t.close}><X size={19} /></button></div>
        <div className="admin-sidebar__nav">
          {(['main', 'content', 'system'] as const).map((group) => (
            <div className="admin-nav-group" key={group}>
              <span className="admin-nav-group__label">{locale === 'fa' ? (group === 'main' ? 'اصلی' : group === 'content' ? 'محتوا' : 'سامانه') : group === 'main' ? 'Main' : group === 'content' ? 'Content' : 'System'}</span>
              {modules.filter((item) => item.group === group).map((item) => {
                const Icon = item.icon;
                return <button key={item.id} className={`admin-nav-item ${module === item.id ? 'is-active' : ''}`} onClick={() => { setModule(item.id); setMobileNav(false); }}><Icon size={17} /><span>{t[moduleLabels[item.id]]}</span>{item.id === 'messages' ? <i className="admin-nav-item__badge" /> : null}</button>;
              })}
            </div>
          ))}
        </div>
        <div className="admin-sidebar__foot"><span className="admin-online-dot" />{t.online}<span className="admin-sidebar__version">CMS / 01</span></div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-mobile-menu" onClick={() => setMobileNav(true)} aria-label={t.menu}><Menu size={20} /></button>
          <div className="admin-breadcrumb"><span>{t.admin}</span><i>/</i><b>{title}</b></div>
          <div className="admin-topbar__actions">
            <a className="admin-view-site" href={locale === 'fa' ? '/fa/' : '/en/'} target="_blank" rel="noreferrer">{t.site}<ArrowUpRightIcon /></a>
            <button className="admin-locale-toggle" onClick={toggleLocale} lang={locale === 'fa' ? 'en' : 'fa'}>{locale === 'fa' ? 'EN' : 'فا'}</button>
            <div className="admin-user"><span className="admin-user__avatar">{user.display_name.slice(0, 1).toUpperCase()}</span><span><b>{user.display_name}</b><small>{user.email}</small></span></div>
            <button className="admin-icon-button" onClick={logout} aria-label={t.logout} title={t.logout}><LogOut size={17} /></button>
          </div>
        </header>
        <main className="admin-content" id="admin-main">
          {notice ? <div className={`admin-toast admin-toast--${notice.kind}`} role="status"><span>{notice.kind === 'success' ? <Check size={17} /> : <X size={17} />}</span>{notice.text}<button onClick={() => setNotice(null)} aria-label={t.close}><X size={15} /></button></div> : null}
          {module === 'dashboard' ? <DashboardPane locale={locale} onNavigate={setModule} /> : null}
          {module === 'profile' ? <ProfilePane locale={locale} csrf={csrf} notify={notify} /> : null}
          {resourceDefinitions[module] ? <ResourcePane key={module} module={module} locale={locale} csrf={csrf} notify={notify} /> : null}
          {module === 'messages' ? <MessagesPane locale={locale} csrf={csrf} notify={notify} /> : null}
          {module === 'media' ? <MediaPane locale={locale} csrf={csrf} notify={notify} /> : null}
          {module === 'settings' ? <SettingsPane locale={locale} csrf={csrf} notify={notify} /> : null}
          {module === 'security' ? <SecurityPane locale={locale} csrf={csrf} notify={notify} /> : null}
        </main>
        <footer className="admin-footer"><span>AG / CMS</span><span>{locale === 'fa' ? 'محتوا با ویرایش مستقل فارسی و انگلیسی' : 'Independent Persian and English content'}</span></footer>
      </div>
    </div>
  );
}

function ArrowUpRightIcon() { return <span className="arrow-up-right" aria-hidden="true">↗</span>; }

function LoginScreen({ locale, onLogin, unavailable, onLocale }: { locale: AdminLocale; onLogin: (email: string, password: string) => Promise<void>; unavailable: boolean; onLocale: () => void }) {
  const t = useAdminText(locale);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError('');
    try { await onLogin(email.trim(), password); }
    catch (failure) { setError(failure instanceof ApiError && failure.status === 401 ? t.loginFailed : t.apiUnavailable); }
    finally { setBusy(false); }
  };
  return (
    <main className={`admin-login admin-login--${locale}`} dir={locale === 'fa' ? 'rtl' : 'ltr'} lang={locale}>
      <div className="admin-login__top"><a className="admin-login__brand" href="/fa/"><span className="admin-mark">AG<span>.</span></span><span>AMIRALI GHAMKHAR</span></a><button onClick={onLocale} className="admin-locale-toggle">{locale === 'fa' ? 'EN' : 'فا'}</button></div>
      <div className="admin-login__card">
        <div className="admin-login__symbol"><LockKeyhole size={22} /></div>
        <p className="admin-login__eyebrow">PRIVATE ACCESS / 01</p>
        <h1>{t.signIn}</h1><p className="admin-login__hint">{t.signInHint}</p>
        {unavailable ? <div className="admin-alert admin-alert--error">{t.apiUnavailable}</div> : null}
        <form onSubmit={submit}>
          <label className="admin-field"><span>{t.email}</span><input type="email" required maxLength={254} autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} dir="ltr" /></label>
          <label className="admin-field"><span>{t.password}</span><input type="password" required maxLength={200} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} dir="ltr" /></label>
          {error ? <p className="admin-form-error" role="alert">{error}</p> : null}
          <button className="admin-primary-button" type="submit" disabled={busy}>{busy ? <LoaderCircle className="spin" size={16} /> : <ShieldCheck size={17} />}{busy ? t.signingIn : t.signInAction}</button>
        </form>
        <div className="admin-login__secure"><span className="admin-online-dot" />{t.online}<span>HTTPS / CSRF</span></div>
      </div>
      <p className="admin-login__foot">{locale === 'fa' ? 'دسترسی فقط برای مدیر مجاز است.' : 'Authorized administrator access only.'}</p>
    </main>
  );
}

function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return <div className="admin-page-title"><div><p>AG / CONTENT MANAGEMENT</p><h1>{title}</h1>{subtitle ? <span>{subtitle}</span> : null}</div>{action ? <div className="admin-page-title__action">{action}</div> : null}</div>;
}

function DashboardPane({ locale, onNavigate }: { locale: AdminLocale; onNavigate: (module: ModuleId) => void }) {
  const t = useAdminText(locale);
  const [dashboard, setDashboard] = useState<AnyRecord | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => { apiRequest<AnyRecord>('/api/v1/admin/dashboard').then(setDashboard).catch(() => setError(true)); }, []);
  const counts = dashboard?.counts ?? {};
  const cards: Array<{ key: string; label: string; module: ModuleId; icon: typeof FolderKanban }> = [
    { key: 'published_projects', label: t.projects, module: 'projects', icon: FolderKanban },
    { key: 'expertise', label: t.expertise, module: 'expertise', icon: BrainCircuit },
    { key: 'unread_messages', label: t.unread, module: 'messages', icon: Mail },
    { key: 'media_library', label: t.media, module: 'media', icon: Images },
    { key: 'experience', label: t.experience, module: 'experience', icon: BriefcaseBusiness },
    { key: 'publications', label: t.publications, module: 'publications', icon: BookOpen },
  ];
  return (
    <div className="admin-pane">
      <PageTitle title={t.dashboard} subtitle={locale === 'fa' ? 'وضعیت محتوای وب‌سایت در یک نگاه.' : 'A quick view of your website content.'} />
      {error ? <div className="admin-alert admin-alert--error">{t.apiUnavailable}</div> : null}
      <div className="admin-stat-grid">{cards.map((card, index) => { const Icon = card.icon; return <button className="admin-stat" key={card.key} onClick={() => onNavigate(card.module)}><span className="admin-stat__top"><span>0{index + 1} / {t.count}</span><Icon size={18} /></span><b>{dashboard ? counts[card.key] ?? 0 : '—'}</b><span className="admin-stat__label">{card.label}</span></button>; })}</div>
      <div className="admin-dashboard-grid">
        <section className="admin-panel"><div className="admin-panel__heading"><h2>{t.recent}</h2><button className="admin-text-button" onClick={() => onNavigate('messages')}>{t.open}<ArrowRight size={15} /></button></div>
          {dashboard?.recent_messages?.length ? <div className="admin-message-preview">{dashboard.recent_messages.map((message: AnyRecord) => <button key={message.id} onClick={() => onNavigate('messages')}><span className={`message-state message-state--${message.status}`} /><span><b>{message.name}</b><small>{message.email}</small></span><time>{String(message.created_at).slice(0, 10)}</time></button>)}</div> : <div className="admin-empty admin-empty--small"><Mail size={19} /><span>{error ? t.unavailable : t.noItems}</span></div>}
        </section>
        <section className="admin-panel admin-panel--welcome"><span className="admin-panel__index">AG / SYSTEM NOTE</span><h2>{locale === 'fa' ? 'دو زبان؛ دو مسیر ویرایش مستقل.' : 'Two languages. Two independent edits.'}</h2><p>{locale === 'fa' ? 'هر بخش ترجمهٔ فارسی و انگلیسی جداگانه دارد. هنگام ویرایش یک زبان، نسخهٔ دیگر دست‌نخورده باقی می‌ماند.' : 'Every content module has separate Persian and English fields. Editing one language never replaces the other.'}</p><button className="admin-text-button" onClick={() => onNavigate('profile')}>{locale === 'fa' ? 'ویرایش پروفایل' : 'Edit profile'}<ArrowRight size={15} /></button></section>
      </div>
    </div>
  );
}

function makeDefaultRecord(module: ModuleId): AnyRecord {
  const definition = resourceDefinitions[module];
  if (!definition) return {};
  const record: AnyRecord = { translations: blankTranslations() };
  definition.base.forEach((field) => {
    if (field.key === 'status') record.status = 'draft';
    else if (field.key === 'sort_order') record.sort_order = 0;
    else if (field.type === 'checkbox') record[field.key] = false;
    else record[field.key] = '';
  });
  if (module === 'projects') record.technologies = '';
  return record;
}

function ResourcePane({ module, locale, csrf, notify }: { module: ModuleId; locale: AdminLocale; csrf: string; notify: (text: string, kind?: 'success' | 'error') => void }) {
  const t = useAdminText(locale);
  const definition = resourceDefinitions[module]!;
  const [records, setRecords] = useState<AnyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<AnyRecord | null>(null);
  const [base, setBase] = useState<AnyRecord>({});
  const [translations, setTranslations] = useState<TranslationMap>(blankTranslations());
  const [editLocale, setEditLocale] = useState<AdminLocale>(locale);
  const [saving, setSaving] = useState(false);
  const filteredRecords = useMemo(() => {
    const term = query.toLocaleLowerCase();
    if (!term) return records;
    return records.filter((record) => JSON.stringify(record).toLocaleLowerCase().includes(term));
  }, [records, query]);

  const load = useCallback(async () => {
    setLoading(true);
    try { const result = await apiRequest<{ items: AnyRecord[] }>(`/api/v1/admin/${module}`); setRecords(result.items ?? []); }
    catch (error) { notify(messageFromError(error, locale), 'error'); }
    finally { setLoading(false); }
  }, [module, locale, notify]);
  useEffect(() => { void load(); }, [load]);

  const openNew = () => { setEditing(makeDefaultRecord(module)); setBase(makeDefaultRecord(module)); setTranslations(blankTranslations()); setEditLocale(locale); };
  const openEdit = (record: AnyRecord) => {
    const copy = { ...record };
    setEditing(copy); setBase({ ...record }); setTranslations({ fa: { ...(record.translations?.fa ?? {}) }, en: { ...(record.translations?.en ?? {}) } }); setEditLocale(locale);
  };
  const closeEditor = () => { setEditing(null); setBase({}); setTranslations(blankTranslations()); };
  const changeBase = (key: string, value: unknown) => setBase((current) => ({ ...current, [key]: value }));
  const changeTranslation = (key: string, value: unknown) => setTranslations((current) => ({ ...current, [editLocale]: { ...current[editLocale], [key]: value } }));

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (saving) return; setSaving(true);
    try {
      const selectedTranslation = { ...translations[editLocale] };
      definition.translation.forEach((field) => {
        if (field.type === 'list' && typeof selectedTranslation[field.key] === 'string') selectedTranslation[field.key] = selectedTranslation[field.key].split('\n').map((item: string) => item.trim()).filter(Boolean);
      });
      const payload: AnyRecord = { base, translations: { [editLocale]: selectedTranslation } };
      if (module === 'projects') payload.technologies = String(base.technologies || '').split(',').map((value) => value.trim()).filter(Boolean);
      const id = editing?.id;
      const result = await apiRequest<AnyRecord>(id ? `/api/v1/admin/${module}/${id}` : `/api/v1/admin/${module}`, {
        method: id ? 'PATCH' : 'POST', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify(payload),
      });
      setRecords((current) => id ? current.map((item) => item.id === id ? result : item) : [...current, result]);
      closeEditor(); notify(t.saved);
    } catch (error) { notify(messageFromError(error, locale), 'error'); }
    finally { setSaving(false); }
  };

  const remove = async (record: AnyRecord) => {
    if (!window.confirm(t.confirmDelete)) return;
    try { await apiRequest(`/api/v1/admin/${module}/${record.id}`, { method: 'DELETE', headers: { 'X-CSRF-Token': csrf }, body: '{}' }); setRecords((current) => current.filter((item) => item.id !== record.id)); notify(t.deleted); }
    catch (error) { notify(messageFromError(error, locale), 'error'); }
  };

  const titleKey = definition.titleField;
  return (
    <div className="admin-pane">
      <PageTitle title={t[moduleLabels[module]]} subtitle={locale === 'fa' ? 'محتوای فارسی و انگلیسی را جداگانه ویرایش کنید.' : 'Edit Persian and English content independently.'} action={<button className="admin-primary-button admin-primary-button--small" onClick={openNew}><Plus size={16} />{t.new}</button>} />
      <div className="admin-toolbar"><label className="admin-search"><Search size={16} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} /></label><span className="admin-total">{t.count}: {filteredRecords.length}</span></div>
      <div className="admin-record-list">
        {loading ? <div className="admin-empty"><LoaderCircle className="spin" size={21} /><span>{t.loading}</span></div> : filteredRecords.length ? filteredRecords.map((record, index) => (
          <article className="admin-record" key={record.id}>
            <span className="admin-record__index">{String(index + 1).padStart(2, '0')}</span>
            <span className="admin-record__main"><b>{localizedLabel(record, locale, titleKey) || (locale === 'fa' ? 'بدون عنوان' : 'Untitled')}</b><small dir="ltr">{record.slug || record.email || record.url || `#${record.id}`}</small></span>
            <span className={`admin-status admin-status--${record.status || (record.is_visible ? 'published' : 'draft')}`}>{record.status === 'published' ? t.published : record.status === 'draft' ? t.draft : record.is_visible ? t.visible : t.hidden}</span>
            <div className="admin-record__languages"><span className={record.translations?.fa && Object.values(record.translations.fa).some(Boolean) ? 'is-filled' : ''}>FA</span><span className={record.translations?.en && Object.values(record.translations.en).some(Boolean) ? 'is-filled' : ''}>EN</span></div>
            <div className="admin-record__actions"><button onClick={() => openEdit(record)} aria-label={`${t.edit} ${localizedLabel(record, locale, titleKey)}`}><FileText size={16} /></button><button className="is-danger" onClick={() => void remove(record)} aria-label={`${t.delete} ${localizedLabel(record, locale, titleKey)}`}><Trash2 size={16} /></button></div>
          </article>
        )) : <div className="admin-empty"><FolderKanban size={25} /><b>{query ? t.noResults : t.noItems}</b><span>{!query ? (locale === 'fa' ? 'با «افزودن» یک مورد تازه ایجاد کنید.' : 'Create the first item with “Add new”.') : null}</span></div>}
      </div>
      {editing ? (
        <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeEditor(); }}>
          <section className="admin-editor" role="dialog" aria-modal="true" aria-labelledby="editor-heading" dir={locale === 'fa' ? 'rtl' : 'ltr'}>
            <header className="admin-editor__header"><div><span>CONTENT / {module.toUpperCase()}</span><h2 id="editor-heading">{editing.id ? t.edit : t.new} {definition.singular[locale]}</h2></div><button className="admin-icon-button" onClick={closeEditor} aria-label={t.close}><X size={19} /></button></header>
            <form onSubmit={save} className="admin-editor__form">
              <div className="admin-editor__scroll">
                <div className="admin-editor__section"><span className="admin-editor__section-title">{locale === 'fa' ? 'اطلاعات مشترک' : 'Shared fields'}</span><div className="admin-form-grid">{definition.base.map((field) => <AdminField key={field.key} field={field} locale={locale} value={base[field.key]} onChange={(value) => changeBase(field.key, value)} />)}</div></div>
                <div className="admin-editor__section">
                  <div className="admin-editor__language-bar"><span className="admin-editor__section-title">{t.language}</span><div className="admin-language-tabs"><button type="button" className={editLocale === 'fa' ? 'is-active' : ''} onClick={() => setEditLocale('fa')}>فارسی <i>FA</i></button><button type="button" className={editLocale === 'en' ? 'is-active' : ''} onClick={() => setEditLocale('en')}>English <i>EN</i></button></div></div>
                  <div className="admin-form-grid">{definition.translation.map((field) => <AdminField key={field.key} field={field} locale={editLocale} value={translations[editLocale][field.key]} onChange={changeTranslation.bind(null, field.key)} />)}</div>
                </div>
                {module === 'projects' && editing.id ? <ProjectGallery projectId={Number(editing.id)} locale={locale} csrf={csrf} notify={notify} /> : null}
              </div>
              <footer className="admin-editor__footer"><button type="button" className="admin-secondary-button" onClick={closeEditor}>{t.cancel}</button><button type="submit" className="admin-primary-button" disabled={saving}>{saving ? <LoaderCircle className="spin" size={16} /> : <Check size={16} />}{saving ? t.saving : t.save}</button></footer>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function AdminField({ field, locale, value, onChange }: { field: FieldDefinition; locale: AdminLocale; value: unknown; onChange: (value: unknown) => void }) {
  const t = useAdminText(locale);
  const label = field.label[locale];
  if (field.type === 'checkbox') return <label className="admin-checkbox-field"><input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} /><span className="admin-checkbox-field__box"><Check size={13} /></span><span>{label}</span></label>;
  if (field.type === 'select') return <label className="admin-field"><span>{label}{field.required ? ' *' : ''}</span><div className="admin-select-wrap"><select required={field.required} value={String(value ?? '')} onChange={(event) => onChange(event.target.value)}>{field.options?.map((option) => <option value={option.value} key={option.value}>{option.label[locale]}</option>)}</select><ChevronDown size={15} /></div>{field.hint ? <small>{field.hint[locale]}</small> : null}</label>;
  const inputType = field.type === 'url' || field.type === 'email' || field.type === 'number' ? field.type : 'text';
  const current = field.type === 'list' ? (Array.isArray(value) ? value.join('\n') : String(value ?? '')) : String(value ?? '');
  return (
    <label className={`admin-field ${field.type === 'textarea' || field.type === 'list' ? 'admin-field--wide' : ''}`}>
      <span>{label}{field.required ? ' *' : ''}</span>
      {field.type === 'textarea' || field.type === 'list' ? <textarea rows={field.type === 'list' ? 4 : 5} required={field.required} value={current} onChange={(event) => onChange(event.target.value)} /> : <input type={inputType} inputMode={field.type === 'number' ? 'numeric' : undefined} required={field.required} value={current} onChange={(event) => onChange(field.type === 'number' ? (event.target.value === '' ? '' : Number(event.target.value)) : event.target.value)} dir={field.type === 'url' ? 'ltr' : undefined} />}
      {field.hint ? <small>{field.hint[locale]}</small> : null}
      {field.type === 'list' ? <small>{t.details}</small> : null}
    </label>
  );
}

function ProfilePane({ locale, csrf, notify }: { locale: AdminLocale; csrf: string; notify: (text: string, kind?: 'success' | 'error') => void }) {
  const t = useAdminText(locale);
  const [profile, setProfile] = useState<AnyRecord | null>(null);
  const [base, setBase] = useState<AnyRecord>({});
  const [translations, setTranslations] = useState<TranslationMap>(blankTranslations());
  const [editLocale, setEditLocale] = useState<AdminLocale>(locale);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    apiRequest<AnyRecord>('/api/v1/admin/profile').then((record) => { setProfile(record); setBase(record); setTranslations({ fa: { ...(record.translations?.fa ?? {}) }, en: { ...(record.translations?.en ?? {}) } }); }).catch((error) => notify(messageFromError(error, locale), 'error'));
  }, [locale, notify]);
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true);
    try {
      const result = await apiRequest<AnyRecord>('/api/v1/admin/profile', { method: 'PATCH', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify({ base, translations: { [editLocale]: translations[editLocale] } }) });
      setProfile(result); setBase(result); setTranslations({ fa: { ...(result.translations?.fa ?? {}) }, en: { ...(result.translations?.en ?? {}) } }); notify(t.profileSaved);
    } catch (error) { notify(messageFromError(error, locale), 'error'); }
    finally { setSaving(false); }
  };
  const fieldsBase: FieldDefinition[] = [
    { key: 'email', label: { fa: t.emailContact, en: 'Public email' }, type: 'email' },
    { key: 'github_url', label: { fa: t.github, en: 'GitHub URL' }, type: 'url' },
    { key: 'linkedin_url', label: { fa: t.linkedin, en: 'LinkedIn URL' }, type: 'url' },
    { key: 'portrait_url', label: { fa: t.portrait, en: 'Portrait URL' }, type: 'text', hint: { fa: 'می‌توانید نشانی /uploads/ یا شناسهٔ رسانه را در فیلد بعد وارد کنید.', en: 'Use an /uploads/ path or a media ID in the next field.' } },
    { key: 'portrait_media_id', label: { fa: t.portraitMedia, en: 'Portrait media ID' }, type: 'number' },
  ];
  const fieldsTranslation: FieldDefinition[] = [
    { key: 'name', label: { fa: t.name, en: 'Name' }, required: true },
    { key: 'role', label: { fa: t.role, en: 'Professional title' } },
    { key: 'hero_greeting', label: { fa: t.greeting, en: 'Greeting' } },
    { key: 'statement', label: { fa: t.statement, en: 'Main statement' }, type: 'textarea', required: true },
    { key: 'about', label: { fa: t.about, en: 'About' }, type: 'textarea' },
    { key: 'seo_title', label: { fa: t.seoTitle, en: 'SEO title' } },
    { key: 'seo_description', label: { fa: t.seoDescription, en: 'SEO description' }, type: 'textarea' },
  ];
  return (
    <div className="admin-pane"><PageTitle title={t.profile} subtitle={locale === 'fa' ? 'اطلاعات صاحب وب‌سایت، معرفی و متن‌های سئو.' : 'Owner details, hero content, and SEO metadata.'} />
      {!profile ? <div className="admin-empty"><LoaderCircle className="spin" size={20} /><span>{t.loading}</span></div> : <form className="admin-profile-form" onSubmit={save}>
        <section className="admin-panel"><div className="admin-panel__heading"><div><span className="admin-panel__index">01 / SHARED</span><h2>{locale === 'fa' ? 'اطلاعات مشترک' : 'Shared information'}</h2></div></div><div className="admin-form-grid">{fieldsBase.map((field) => <AdminField key={field.key} field={field} locale={locale} value={base[field.key]} onChange={(value) => setBase((current) => ({ ...current, [field.key]: value }))} />)}</div></section>
        <section className="admin-panel"><div className="admin-panel__heading"><div><span className="admin-panel__index">02 / BILINGUAL</span><h2>{locale === 'fa' ? 'معرفی دو‌زبانه' : 'Bilingual profile'}</h2></div><div className="admin-language-tabs"><button type="button" className={editLocale === 'fa' ? 'is-active' : ''} onClick={() => setEditLocale('fa')}>فارسی <i>FA</i></button><button type="button" className={editLocale === 'en' ? 'is-active' : ''} onClick={() => setEditLocale('en')}>English <i>EN</i></button></div></div><div className="admin-form-grid">{fieldsTranslation.map((field) => <AdminField key={field.key} field={field} locale={editLocale} value={translations[editLocale][field.key]} onChange={(value) => setTranslations((current) => ({ ...current, [editLocale]: { ...current[editLocale], [field.key]: value } }))} />)}</div></section>
        <div className="admin-form-submit"><span>{locale === 'fa' ? `در حال ویرایش: ${editLocale === 'fa' ? 'فارسی' : 'English'}` : `Editing: ${editLocale === 'fa' ? 'Persian' : 'English'}`}</span><button className="admin-primary-button" type="submit" disabled={saving}>{saving ? <LoaderCircle className="spin" size={16} /> : <Check size={16} />}{saving ? t.saving : t.save}</button></div>
      </form>}
    </div>
  );
}

function ProjectGallery({ projectId, locale, csrf, notify }: { projectId: number; locale: AdminLocale; csrf: string; notify: (text: string, kind?: 'success' | 'error') => void }) {
  const t = useAdminText(locale);
  const [images, setImages] = useState<AnyRecord[]>([]);
  const [media, setMedia] = useState<AnyRecord[]>([]);
  const [mediaId, setMediaId] = useState('');
  const [altFa, setAltFa] = useState('');
  const [altEn, setAltEn] = useState('');
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    try { const [gallery, library] = await Promise.all([apiRequest<{ items: AnyRecord[] }>(`/api/v1/admin/projects/${projectId}/images`), apiRequest<{ items: AnyRecord[] }>('/api/v1/admin/media')]); setImages(gallery.items ?? []); setMedia(library.items ?? []); }
    catch (error) { notify(messageFromError(error, locale), 'error'); }
    finally { setLoading(false); }
  }, [projectId, locale, notify]);
  useEffect(() => { void load(); }, [load]);
  const add = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!mediaId) return;
    try { await apiRequest(`/api/v1/admin/projects/${projectId}/images`, { method: 'POST', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify({ media_id: Number(mediaId), alt_fa: altFa, alt_en: altEn, sort_order: images.length }) }); setAltFa(''); setAltEn(''); await load(); notify(t.saved); }
    catch (error) { notify(messageFromError(error, locale), 'error'); }
  };
  const remove = async (id: number) => {
    if (!window.confirm(t.confirmDelete)) return;
    try { await apiRequest(`/api/v1/admin/projects/${projectId}/images/${id}`, { method: 'DELETE', headers: { 'X-CSRF-Token': csrf }, body: '{}' }); setImages((current) => current.filter((image) => image.id !== id)); notify(t.deleted); }
    catch (error) { notify(messageFromError(error, locale), 'error'); }
  };
  return <div className="admin-editor__section admin-gallery"><span className="admin-editor__section-title">{t.gallery}</span>
    <form className="admin-gallery__form" onSubmit={add}><label className="admin-field admin-field--wide"><span>{t.chooseMedia}</span><select value={mediaId} onChange={(event) => setMediaId(event.target.value)} required><option value="">{media.length ? t.chooseMedia : t.noMedia}</option>{media.map((item) => <option value={item.id} key={item.id}>{item.id} — {item.original_name}</option>)}</select></label><div className="admin-form-grid"><AdminField field={{ key: 'alt_fa', label: { fa: 'متن جایگزین فارسی', en: 'Persian alt text' } }} locale={locale} value={altFa} onChange={(value) => setAltFa(String(value))} /><AdminField field={{ key: 'alt_en', label: { fa: 'متن جایگزین انگلیسی', en: 'English alt text' } }} locale={locale} value={altEn} onChange={(value) => setAltEn(String(value))} /></div><button type="submit" className="admin-secondary-button" disabled={!media.length}><Plus size={15} />{t.addImage}</button></form>
    {loading ? <span className="admin-muted">{t.loading}</span> : images.length ? <div className="admin-gallery__grid">{images.map((image) => <div className="admin-gallery-thumb" key={image.id}><img src={image.media_url || image.image_url} alt={locale === 'fa' ? image.alt_fa : image.alt_en} /><button type="button" onClick={() => void remove(image.id)} aria-label={t.delete}><Trash2 size={15} /></button></div>)}</div> : <div className="admin-empty admin-empty--small">{t.noGallery}</div>}
  </div>;
}

function MessagesPane({ locale, csrf, notify }: { locale: AdminLocale; csrf: string; notify: (text: string, kind?: 'success' | 'error') => void }) {
  const t = useAdminText(locale);
  const [messages, setMessages] = useState<AnyRecord[]>([]);
  const [selected, setSelected] = useState<AnyRecord | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { setLoading(true); try { const result = await apiRequest<{ items: AnyRecord[] }>(`/api/v1/admin/contact-messages${query ? `?q=${encodeURIComponent(query)}` : ''}`); setMessages(result.items ?? []); } catch (error) { notify(messageFromError(error, locale), 'error'); } finally { setLoading(false); } }, [query, locale, notify]);
  useEffect(() => { const id = window.setTimeout(() => void load(), 180); return () => window.clearTimeout(id); }, [load]);
  const updateStatus = async (message: AnyRecord, status: string) => {
    try { const updated = await apiRequest<AnyRecord>(`/api/v1/admin/contact-messages/${message.id}`, { method: 'PATCH', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify({ status }) }); setMessages((current) => current.map((item) => item.id === message.id ? updated : item)); setSelected(updated); notify(t.saved); }
    catch (error) { notify(messageFromError(error, locale), 'error'); }
  };
  const remove = async (message: AnyRecord) => {
    if (!window.confirm(t.confirmDelete)) return;
    try { await apiRequest(`/api/v1/admin/contact-messages/${message.id}`, { method: 'DELETE', headers: { 'X-CSRF-Token': csrf }, body: '{}' }); setMessages((current) => current.filter((item) => item.id !== message.id)); setSelected(null); notify(t.deleted); }
    catch (error) { notify(messageFromError(error, locale), 'error'); }
  };
  return <div className="admin-pane"><PageTitle title={t.messages} subtitle={locale === 'fa' ? 'پیام‌های ارسال‌شده از فرم تماس.' : 'Submissions from the public contact form.'} />
    <div className="admin-toolbar"><label className="admin-search"><Search size={16} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} /></label><span className="admin-total">{messages.length} / {t.count}</span></div>
    {loading ? <div className="admin-empty"><LoaderCircle className="spin" size={20} /><span>{t.loading}</span></div> : messages.length ? <div className="admin-message-list">{messages.map((message) => <button className={`admin-message-row ${selected?.id === message.id ? 'is-selected' : ''}`} key={message.id} onClick={() => { setSelected(message); if (message.status === 'unread') void updateStatus(message, 'read'); }}><span className={`message-state message-state--${message.status}`} /><span className="admin-message-row__body"><b>{message.name}</b><small>{message.email}</small><span>{message.message}</span></span><time>{String(message.created_at).replace('T', ' ').slice(0, 16)}</time><ArrowLeft size={16} /></button>)}</div> : <div className="admin-empty"><Mail size={25} /><b>{query ? t.noResults : t.noItems}</b></div>}
    {selected ? <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section className="admin-message-detail" role="dialog" aria-modal="true" aria-labelledby="message-title"><header><div><span>{t.sentAt} / {selected.created_at}</span><h2 id="message-title">{selected.name}</h2></div><button className="admin-icon-button" onClick={() => setSelected(null)} aria-label={t.close}><X size={18} /></button></header><a className="admin-message-email" href={`mailto:${selected.email}`} dir="ltr">{selected.email}</a><p>{selected.message}</p><footer><button className="admin-secondary-button" onClick={() => void updateStatus(selected, selected.status === 'archived' ? 'read' : 'archived')}>{selected.status === 'archived' ? t.markRead : t.archive}</button><button className="admin-danger-button" onClick={() => void remove(selected)}><Trash2 size={15} />{t.delete}</button></footer></section></div> : null}
  </div>;
}

function MediaPane({ locale, csrf, notify }: { locale: AdminLocale; csrf: string; notify: (text: string, kind?: 'success' | 'error') => void }) {
  const t = useAdminText(locale);
  const [items, setItems] = useState<AnyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeLocale, setActiveLocale] = useState<AdminLocale>(locale);
  const load = useCallback(async () => { setLoading(true); try { const result = await apiRequest<{ items: AnyRecord[] }>('/api/v1/admin/media'); setItems(result.items ?? []); } catch (error) { notify(messageFromError(error, locale), 'error'); } finally { setLoading(false); } }, [locale, notify]);
  useEffect(() => { void load(); }, [load]);
  const upload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = event.currentTarget; const input = form.elements.namedItem('image') as HTMLInputElement | null; const file = input?.files?.[0]; if (!file) return;
    const body = new FormData(); body.append('file', file); setUploading(true);
    try { await apiRequest('/api/v1/admin/media', { method: 'POST', headers: { 'X-CSRF-Token': csrf }, body }); await load(); form.reset(); notify(t.saved); }
    catch (error) { notify(messageFromError(error, locale), 'error'); }
    finally { setUploading(false); }
  };
  const saveAlt = async (item: AnyRecord, lang: AdminLocale, value: string) => {
    const key = lang === 'fa' ? 'alt_fa' : 'alt_en';
    try { const updated = await apiRequest<AnyRecord>(`/api/v1/admin/media/${item.id}`, { method: 'PATCH', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify({ [key]: value }) }); setItems((current) => current.map((mediaItem) => mediaItem.id === item.id ? updated : mediaItem)); notify(t.saved); }
    catch (error) { notify(messageFromError(error, locale), 'error'); }
  };
  const remove = async (item: AnyRecord) => {
    if (!window.confirm(t.confirmDelete)) return;
    try { await apiRequest(`/api/v1/admin/media/${item.id}`, { method: 'DELETE', headers: { 'X-CSRF-Token': csrf }, body: '{}' }); setItems((current) => current.filter((mediaItem) => mediaItem.id !== item.id)); notify(t.deleted); }
    catch (error) { notify(error instanceof ApiError && error.status === 409 ? (locale === 'fa' ? 'این تصویر هنوز در پروفایل یا پروژه‌ای استفاده می‌شود.' : 'This image is still used by a profile or project.') : messageFromError(error, locale), 'error'); }
  };
  const copyUrl = async (url: string) => { try { await navigator.clipboard.writeText(url); notify(t.copyUrl); } catch { notify(url, 'error'); } };
  return <div className="admin-pane"><PageTitle title={t.media} subtitle={t.uploadHint} />
    <form className="admin-upload" onSubmit={upload}><div className="admin-upload__icon"><Upload size={21} /></div><div className="admin-upload__copy"><b>{t.upload}</b><span>{t.uploadHint}</span></div><label className="admin-secondary-button admin-file-button"><input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required />{t.chooseFile}</label><button className="admin-primary-button" disabled={uploading}>{uploading ? <LoaderCircle className="spin" size={16} /> : <Upload size={16} />}{uploading ? t.uploading : t.upload}</button></form>
    {loading ? <div className="admin-empty"><LoaderCircle className="spin" size={20} /><span>{t.loading}</span></div> : items.length ? <div className="admin-media-grid">{items.map((item) => <article className="admin-media-card" key={item.id}><div className="admin-media-card__image"><img src={item.public_url} alt={activeLocale === 'fa' ? item.alt_fa : item.alt_en} loading="lazy" /><span>#{item.id} / {item.mime_type.replace('image/', '').toUpperCase()}</span></div><div className="admin-media-card__body"><div className="admin-language-tabs admin-language-tabs--small"><button className={activeLocale === 'fa' ? 'is-active' : ''} onClick={() => setActiveLocale('fa')} type="button">FA</button><button className={activeLocale === 'en' ? 'is-active' : ''} onClick={() => setActiveLocale('en')} type="button">EN</button></div><form onSubmit={(event) => { event.preventDefault(); const input = (event.currentTarget.elements.namedItem('alt') as HTMLInputElement); void saveAlt(item, activeLocale, input.value); }}><label className="admin-field"><span>{t.imageAlt}</span><input name="alt" defaultValue={activeLocale === 'fa' ? item.alt_fa : item.alt_en} /></label><button className="admin-secondary-button admin-secondary-button--small" type="submit">{t.save}</button></form><div className="admin-media-card__url"><code dir="ltr">{item.public_url}</code><button type="button" onClick={() => void copyUrl(item.public_url)} aria-label={t.copyUrl}><Link2 size={14} /></button></div><div className="admin-media-card__foot"><small>{(Number(item.size_bytes) / 1024).toFixed(0)} KB · {item.original_name}</small><button className="admin-icon-button is-danger" type="button" onClick={() => void remove(item)} aria-label={t.delete}><Trash2 size={15} /></button></div></div></article>)}</div> : <div className="admin-empty"><Images size={25} /><b>{t.noMedia}</b></div>}
  </div>;
}

function SettingsPane({ locale, csrf, notify }: { locale: AdminLocale; csrf: string; notify: (text: string, kind?: 'success' | 'error') => void }) {
  const t = useAdminText(locale);
  const [settings, setSettings] = useState<AnyRecord>({ default_locale: 'fa', global_seo_title_fa: '', global_seo_title_en: '', global_seo_description_fa: '', global_seo_description_en: '', og_image: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => { apiRequest<{ items: AnyRecord[] }>('/api/v1/admin/settings').then((result) => { const mapped = { ...settings }; result.items.forEach((item) => { mapped[item.setting_key] = item.value; }); setSettings(mapped); }).catch((error) => notify(messageFromError(error, locale), 'error')).finally(() => setLoading(false)); }, []);
  const fields: FieldDefinition[] = [
    { key: 'global_seo_title_fa', label: { fa: 'عنوان سئو — فارسی', en: 'SEO title — Persian' } },
    { key: 'global_seo_title_en', label: { fa: 'عنوان سئو — انگلیسی', en: 'SEO title — English' } },
    { key: 'global_seo_description_fa', label: { fa: 'توضیحات سئو — فارسی', en: 'SEO description — Persian' }, type: 'textarea' },
    { key: 'global_seo_description_en', label: { fa: 'توضیحات سئو — انگلیسی', en: 'SEO description — English' }, type: 'textarea' },
    { key: 'og_image', label: { fa: 'تصویر پیش‌فرض Open Graph', en: 'Default Open Graph image' }, type: 'text', hint: { fa: 'نشانی /uploads/ یا پیوند کامل تصویر.', en: 'Use an /uploads/ path or a full image URL.' } },
  ];
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true);
    try { await apiRequest('/api/v1/admin/settings', { method: 'PATCH', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify({ settings }) }); notify(t.saved); }
    catch (error) { notify(messageFromError(error, locale), 'error'); }
    finally { setSaving(false); }
  };
  return <div className="admin-pane"><PageTitle title={t.settings} subtitle={t.settingsTitle} />{loading ? <div className="admin-empty"><LoaderCircle className="spin" size={20} /><span>{t.loading}</span></div> : <form className="admin-panel admin-settings" onSubmit={save}><div className="admin-form-grid">{fields.map((field) => <AdminField key={field.key} field={field} locale={locale} value={settings[field.key] ?? ''} onChange={(value) => setSettings((current) => ({ ...current, [field.key]: value }))} />)}</div><div className="admin-form-submit"><span>{locale === 'fa' ? 'تنظیمات سئو برای فرادادهٔ عمومی استفاده می‌شوند.' : 'SEO settings provide the public site metadata defaults.'}</span><button className="admin-primary-button" disabled={saving}>{saving ? <LoaderCircle className="spin" size={16} /> : <Check size={16} />}{saving ? t.saving : t.saveSettings}</button></div></form>}</div>;
}

function SecurityPane({ locale, csrf, notify }: { locale: AdminLocale; csrf: string; notify: (text: string, kind?: 'success' | 'error') => void }) {
  const t = useAdminText(locale);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); const form = event.currentTarget; const data = new FormData(form); const current = String(data.get('current') || ''); const next = String(data.get('next') || ''); const confirm = String(data.get('confirm') || '');
    if (Array.from(next).length < 12 || new TextEncoder().encode(next).length > 72) { setError(t.passwordRule); return; }
    if (next !== confirm) { setError(t.passwordMismatch); return; }
    setBusy(true);
    try { const result = await apiRequest<{ csrf_token: string }>('/api/v1/admin/security/password', { method: 'POST', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify({ current_password: current, new_password: next }) }); form.reset(); notify(t.passwordChanged); if (result.csrf_token) window.location.reload(); }
    catch (failure) { setError(failure instanceof ApiError && failure.status === 403 ? (locale === 'fa' ? 'گذرواژهٔ فعلی اشتباه است.' : 'Current password is incorrect.') : messageFromError(failure, locale)); }
    finally { setBusy(false); }
  };
  return <div className="admin-pane"><PageTitle title={t.security} subtitle={locale === 'fa' ? 'گذرواژهٔ مدیر را با یک عبارت منحصربه‌فرد و طولانی نگه دارید.' : 'Protect the administrator account with a long, unique password.'} /><form className="admin-panel admin-security-form" onSubmit={submit}><div className="admin-panel__heading"><div><span className="admin-panel__index">ACCOUNT / PASSWORD</span><h2>{t.updatePassword}</h2></div><ShieldCheck size={22} /></div><label className="admin-field"><span>{t.passwordCurrent}</span><input type="password" name="current" autoComplete="current-password" required maxLength={200} dir="ltr" /></label><label className="admin-field"><span>{t.passwordNew}</span><input type="password" name="next" autoComplete="new-password" required minLength={12} maxLength={72} dir="ltr" /></label><label className="admin-field"><span>{t.passwordConfirm}</span><input type="password" name="confirm" autoComplete="new-password" required minLength={12} maxLength={72} dir="ltr" /></label><p className="admin-field-hint">{t.passwordRule}</p>{error ? <p className="admin-form-error" role="alert">{error}</p> : null}<button className="admin-primary-button" disabled={busy}>{busy ? <LoaderCircle className="spin" size={16} /> : <LockKeyhole size={16} />}{busy ? t.saving : t.updatePassword}</button></form></div>;
}
