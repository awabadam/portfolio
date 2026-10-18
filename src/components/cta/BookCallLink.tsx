"use client";

import { useState, type MouseEvent } from "react";
import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { trackCTAClick } from "@/lib/analytics/gtm";
import { CAL_BOOKING_URL, calEmbedUrl } from "@/lib/contactLinks";
import { cn } from "@/lib/utils";

interface BookCallLinkProps {
  /** Where the click came from, for analytics (e.g. "pricing_footer"). */
  location: string;
  /** outline = bordered pill (default). text = plain underlined link. */
  variant?: "outline" | "text";
  /** Use on dark/photo backgrounds. */
  onDark?: boolean;
  className?: string;
}

/**
 * Opens the Cal.com 15-minute intro call in a popup on the page. It is still
 * a real link, so cmd/ctrl-click, middle-click and no-JS open Cal.com in a
 * new tab.
 */
export default function BookCallLink({
  location,
  variant = "outline",
  onDark,
  className,
}: BookCallLinkProps) {
  const t = useTranslations("common");
  const { resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    trackCTAClick("book_call", location);
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    setOpen(true);
  }

  return (
    <>
      <a
        href={CAL_BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={cn(
          "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors",
          variant === "outline" &&
            (onDark
              ? "h-11 rounded-lg border border-white/30 px-5 text-white hover:bg-white/10"
              : "h-11 rounded-lg border border-border bg-background px-5 text-foreground hover:bg-muted"),
          variant === "text" &&
            (onDark
              ? "text-white/80 underline-offset-4 hover:text-white hover:underline"
              : "text-foreground underline-offset-4 hover:underline"),
          className,
        )}
      >
        <CalendarDays className="h-4 w-4" aria-hidden="true" />
        {t("bookCall")}
      </a>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="z-[60] flex h-[90dvh] max-h-[720px] max-w-4xl md:max-h-[640px] flex-col gap-0 overflow-hidden p-0 pt-12">
          <DialogTitle className="absolute left-5 top-4 text-sm font-medium">{t("bookCall")}</DialogTitle>
          {open && (
            <iframe
              src={calEmbedUrl(resolvedTheme === "dark" ? "dark" : "light")}
              title={t("bookCall")}
              className="block w-full flex-1 border-t border-border"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
