import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from "@/components";
import { ConditionalLayout, ConditionalFooter } from "@/components/layout/ConditionalLayout";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PageTracking from "@/components/PageTracking";
import { WhatsAppProvider } from "@/components/chat/WhatsAppContext";
import { ScrollProgress, SmoothScroll, NoiseOverlay, PageTransition } from "@/components/effects";
import { Toaster } from "@/components/ui/toaster";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <WhatsAppProvider>
          <GoogleAnalytics />
          <PageTracking />
          <ScrollProgress />
          <SmoothScroll />
          <NoiseOverlay />
          <ConditionalLayout />
          <PageTransition>{children}</PageTransition>
          <ConditionalFooter />
          <Toaster position="top-right" richColors closeButton />
        </WhatsAppProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
