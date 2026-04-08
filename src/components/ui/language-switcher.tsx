"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { localeNames, type Locale } from "@/i18n/config";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  ar: "🇸🇦",
  tr: "🇹🇷",
  fr: "🇫🇷",
};

export function LanguageSwitcher() {
  const t = useTranslations("chat");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: Locale) => {
    // Persist choice so geo-redirect doesn't override it
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=${60 * 60 * 24 * 365}`;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full text-lg">
          <span aria-hidden="true">{localeFlags[locale]}</span>
          <span className="sr-only">{t("changeLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.entries(localeNames) as [Locale, string][]).map(
          ([code, name]) => (
            <DropdownMenuItem
              key={code}
              onClick={() => switchLocale(code)}
              className={locale === code ? "bg-accent" : ""}
            >
              <span className="mr-2 rtl:mr-0 rtl:ml-2">{localeFlags[code]}</span>
              {name}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
