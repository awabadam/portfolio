"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";
import { isRtl, type Locale } from "@/i18n/config";

export default function LocaleHtmlAttributes() {
  const locale = useLocale() as Locale;

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtl(locale) ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
