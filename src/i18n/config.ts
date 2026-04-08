export const locales = ['en', 'ar', 'tr', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
  tr: 'Türkçe',
  fr: 'Français',
};

export const rtlLocales: Locale[] = ['ar'];
export const isRtl = (locale: Locale) => rtlLocales.includes(locale);
