import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { isRtl } from '@/i18n/config';
import { ThemeProvider } from "@/components/theme-provider";
import { ConditionalLayout, ConditionalFooter } from "@/components/layout/ConditionalLayout";
import PageTracking from "@/components/PageTracking";
import { WhatsAppProvider } from "@/components/chat/WhatsAppContext";
import SmoothScroll from "@/components/effects/SmoothScroll";
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

  const rtl = isRtl(locale as any);

  return (
    <div lang={locale} dir={rtl ? 'rtl' : 'ltr'}>
      <NextIntlClientProvider messages={messages}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WhatsAppProvider>
            <PageTracking />
            <SmoothScroll />
            <ConditionalLayout />
            <div className="flex min-h-screen w-full flex-col">{children}</div>
            <ConditionalFooter />
            <Toaster position="top-right" richColors closeButton />
          </WhatsAppProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
    </div>
  );
}
