import React from "react";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Clock, DollarSign } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.aiChatbot');
  const locale = await getLocale();
  const ogLocale = locale === 'ar' ? 'ar_SA' : locale === 'tr' ? 'tr_TR' : 'en_US';

  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      "AI chatbot integration",
      "chatbot development",
      "customer support chatbot",
      "lead generation chatbot",
      "AI assistant",
      "automated chat support",
      "website chatbot",
      "conversational AI",
    ],
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: "https://awab.design/services/ai-chatbot-integration",
      locale: ogLocale,
    },
    alternates: {
      canonical: "/services/ai-chatbot-integration",
      languages: { en: '/services/ai-chatbot-integration', ar: '/ar/services/ai-chatbot-integration', tr: '/tr/services/ai-chatbot-integration' },
    },
  };
}

const AIChatbotIntegrationPage = async () => {
  const t = await getTranslations('services');
  const inclusions = t.raw('aiChatbot.inclusions') as string[];

  return (
    <main className="min-h-screen bg-background pt-32">
      <div className="container mx-auto px-4 py-16">
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t('backToServices')}
        </Link>

        <div className="mb-16">
          <h1 className="mb-6 font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            {t('aiChatbot.heading')}
          </h1>
          <p className="lead mb-8 max-w-3xl text-2xl leading-relaxed text-muted-foreground md:text-3xl">
            {t('aiChatbot.lead')}
          </p>

          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="text-xl font-semibold text-primary">
                {t('aiChatbot.pricing')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg text-muted-foreground">{t('aiChatbot.deliveryTime')}</span>
            </div>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="mb-8 font-display text-3xl font-bold">
            {t('whatsIncluded')}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {inclusions.map((benefit: string) => (
              <div key={benefit} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 font-display text-3xl font-bold">
            {t('ourProcess')}
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="border-t border-border pt-6">
                <span className="mb-2 block font-mono text-sm text-muted-foreground">
                  {t(`aiChatbot.phase${n}Step`)}
                </span>
                <h3 className="mb-2 font-display text-xl font-bold">{t(`aiChatbot.phase${n}Title`)}</h3>
                <p className="text-sm text-muted-foreground">{t(`aiChatbot.phase${n}Desc`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-muted/30 p-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold">
            {t('aiChatbot.ctaHeading')}
          </h2>
          <p className="mb-8 text-muted-foreground">
            {t('aiChatbot.ctaDescription')}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-14 px-8 text-lg">
              <Link href="/rate-calculator">{t('getQuote')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg">
              <Link href="/contact">{t('contactMe')}</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AIChatbotIntegrationPage;
