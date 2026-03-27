import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from '@/i18n/routing';
import { Check, Code, Layout, Palette, Zap, Users, Star } from "lucide-react";
import { useTranslations } from 'next-intl';
import { getTranslations, getLocale } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.webdesign');
  const locale = await getLocale();
  const ogLocale = locale === 'ar' ? 'ar_SA' : locale === 'tr' ? 'tr_TR' : 'en_US';

  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      "webdesign Istanbul",
      "website design Istanbul",
      "web designer Istanbul",
      "website development Istanbul",
      "responsive web design Istanbul",
      "business website Istanbul",
      "professional webdesign Istanbul",
      "Istanbul web design services",
    ],
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: "https://awab.design/webdesign-istanbul",
      siteName: "Awab Elkhalil - Webdesign Istanbul",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t('title'),
      description: t('description'),
      images: ["/img/hero-image.jpg"],
      creator: "@awabelkhalil",
    },
    alternates: {
      canonical: "/webdesign-istanbul",
      languages: { en: '/webdesign-istanbul', ar: '/ar/webdesign-istanbul', tr: '/tr/webdesign-istanbul' },
    },
  };
}

export default function WebdesignIstanbul() {
  const t = useTranslations('webdesignIstanbul');

  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      {/* Hero Section */}
      <section className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {t('heroTitle')}{" "}
            <span className="text-primary">{t('heroHighlight')}</span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground">
            {t('heroDescription')}
          </p>

          {/* Social Proof Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{t('yearsExperience')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium">{t('websitesCreated')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="font-medium">{t('responseTime')}</span>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="#contact">{t('getFreeConsultation')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/projects">{t('viewPortfolio')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              {t('servicesHeading')}
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              {t('servicesDescription')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <Layout className="mb-4 h-10 w-10 text-primary" />
                <CardTitle>{t('businessWebsiteTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  {t('businessWebsiteDesc')}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {t('businessFeature1')}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {t('businessFeature2')}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {t('businessFeature3')}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {t('businessFeature4')}
                  </li>
                </ul>
              </CardContent>
            </Card>


            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <Palette className="mb-4 h-10 w-10 text-primary" />
                <CardTitle>{t('portfolioWebsiteTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  {t('portfolioWebsiteDesc')}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {t('portfolioFeature1')}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {t('portfolioFeature2')}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {t('portfolioFeature3')}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {t('portfolioFeature4')}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              {t('whyChooseHeading')}
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              {t('whyChooseDescription')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">
                {t('localExpertise')}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>{t('localMarket')}</strong>{' '}
                    {t('localMarketDesc')}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>{t('localSeo')}</strong>{' '}
                    {t('localSeoDesc')}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>{t('turkishLanguage')}</strong>{' '}
                    {t('turkishLanguageDesc')}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>{t('localPayment')}</strong>{' '}
                    {t('localPaymentDesc')}
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">{t('professionalStandards')}</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>{t('modernDesign')}</strong>{' '}
                    {t('modernDesignDesc')}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>{t('fastPerformance')}</strong>{' '}
                    {t('fastPerformanceDesc')}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>{t('mobileFirst')}</strong>{' '}
                    {t('mobileFirstDesc')}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>{t('ongoingSupport')}</strong>{' '}
                    {t('ongoingSupportDesc')}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            {t('ctaHeading')}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            {t('ctaDescription')}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">{t('getFreeConsultation')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/projects">{t('viewMyWork')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
