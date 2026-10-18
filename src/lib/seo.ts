// Shared SEO helpers so every page emits the same canonical / hreflang shape.
//
// Canonical host is https://www.awab.design (the apex 308s to www). Every
// localized page lists all four locales plus x-default, which points at the
// English (unprefixed) URL.
import type { Metadata } from "next";
import { locales, defaultLocale, type Locale } from "@/i18n/config";

export const SITE_URL = "https://www.awab.design";

const OG_LOCALES: Record<Locale, string> = {
  en: "en_US",
  ar: "ar_SA",
  tr: "tr_TR",
  fr: "fr_FR",
};

/** Open Graph locale code for a next-intl locale. */
export function ogLocale(locale: string): string {
  return OG_LOCALES[locale as Locale] ?? OG_LOCALES[defaultLocale];
}

/** Path for `path` in a given locale ("/pricing" -> "/tr/pricing"). */
export function localePath(path: string, locale: string): string {
  const clean = path === "/" ? "" : path;
  if (locale === defaultLocale) return clean || "/";
  return `/${locale}${clean}`;
}

/** Absolute URL for `path` in a given locale. */
export function localeUrl(path: string, locale: string = defaultLocale): string {
  const p = localePath(path, locale);
  return p === "/" ? SITE_URL : `${SITE_URL}${p}`;
}

/**
 * `alternates` block for a localized page: a self-referencing canonical for
 * the current locale plus hreflang for en/ar/tr/fr and x-default (English).
 * Next resolves these against metadataBase, so paths stay relative.
 */
export function pageAlternates(path: string, locale: string = defaultLocale): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = localePath(path, l);
  languages["x-default"] = localePath(path, defaultLocale);
  return {
    canonical: localePath(path, locale),
    languages,
  };
}
