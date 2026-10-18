"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

// Rendered from the root layout, outside the next-intl provider, so the copy
// lives here and the locale comes from the URL prefix ("as-needed": en has none).
const COPY = {
  en: {
    text: "I use cookies to see which pages bring clinic inquiries. No ads, no resale.",
    accept: "Accept",
    decline: "Decline",
  },
  ar: {
    text: "أستخدم ملفات تعريف الارتباط لمعرفة الصفحات التي تجلب استفسارات العيادات. بلا إعلانات ولا بيع للبيانات.",
    accept: "موافق",
    decline: "رفض",
  },
  fr: {
    text: "J'utilise des cookies pour voir quelles pages génèrent des demandes de cliniques. Pas de publicité, pas de revente.",
    accept: "Accepter",
    decline: "Refuser",
  },
  tr: {
    text: "Hangi sayfaların klinik taleplerini getirdiğini görmek için çerez kullanıyorum. Reklam yok, veri satışı yok.",
    accept: "Kabul et",
    decline: "Reddet",
  },
} as const;

type Locale = keyof typeof COPY;

function localeFromPath(pathname: string | null): Locale {
  const first = pathname?.split("/")[1];
  return first && first in COPY ? (first as Locale) : "en";
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const copy = COPY[locale];

  useEffect(() => {
    try {
      if (!localStorage.getItem("cookie-consent")) setVisible(true);
    } catch {
      // Storage blocked: stay hidden rather than nag on every page.
    }
  }, []);

  const remember = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem("cookie-consent", value);
    } catch {
      // ignore
    }
    setVisible(false);
  };

  const handleAccept = () => remember("accepted");

  const handleDecline = () => {
    remember("declined");
    // Disable GA/GTM by removing dataLayer
    if (typeof window !== "undefined") {
      (window as any).dataLayer = [];
    }
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookies"
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="fixed bottom-4 start-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-[10px] border border-border bg-background/95 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-sm"
    >
      <p className="text-sm leading-relaxed text-muted-foreground">{copy.text}</p>
      <div className="mt-3 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={handleDecline}>
          {copy.decline}
        </Button>
        <Button size="sm" onClick={handleAccept}>
          {copy.accept}
        </Button>
      </div>
    </div>
  );
}
