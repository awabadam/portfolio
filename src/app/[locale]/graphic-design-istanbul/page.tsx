import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from '@/i18n/routing';
import { Check, Palette, PenTool, Image, Zap, Users, Star } from "lucide-react";
import { useTranslations } from 'next-intl';
import { getTranslations, getLocale } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.graphicDesign');
  const locale = await getLocale();
  const ogLocale = locale === 'ar' ? 'ar_SA' : locale === 'tr' ? 'tr_TR' : 'en_US';

  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      "graphic design Istanbul",
      "logo design Istanbul",
      "graphic designer Istanbul",
      "branding Istanbul",
      "UI/UX design Istanbul",
      "visual design Istanbul",
      "professional graphic design Istanbul",
      "Istanbul graphic design services",
      "brand identity design Istanbul",
    ],
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: "https://awab.design/graphic-design-istanbul",
      siteName: "Awab Elkhalil - Graphic Design Istanbul",
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
      canonical: "/graphic-design-istanbul",
      languages: { en: '/graphic-design-istanbul', ar: '/ar/graphic-design-istanbul', tr: '/tr/graphic-design-istanbul' },
    },
  };
}

export default function GraphicDesignIstanbul() {
  const t = useTranslations('graphicDesignIstanbul');

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
              <span className="font-medium">{t('designProjects')}</span>
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
                <PenTool className="mb-4 h-10 w-10 text-primary" />
                <CardTitle>{t('logoDesignTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  {t('logoDesignDesc')}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {t('logoFeature1')}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {t('logoFeature2')}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {t('logoFeature3')}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {t('logoFeature4')}
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <Palette className="mb-4 h-10 w-10 text-primary" />
                <CardTitle>{t('brandIdentityTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  {t('brandIdentityDesc')}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {t('brandFeature1')}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {t('brandFeature2')}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {t('brandFeature3')}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {t('brandFeature4')}
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <Image className="mb-4 h-10 w-10 text-primary" />
                <CardTitle>{t('uiuxTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  {t('uiuxDesc')}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {t('uiuxFeature1')}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {t('uiuxFeature2')}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {t('uiuxFeature3')}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    {t('uiuxFeature4')}
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
              <h3 className="text-2xl font-semibold">{t('creativeExcellence')}</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>{t('modernTrends')}</strong>{' '}
                    {t('modernTrendsDesc')}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>{t('professionalQuality')}</strong>{' '}
                    {t('professionalQualityDesc')}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>{t('creativeProcess')}</strong>{' '}
                    {t('creativeProcessDesc')}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>{t('brandStrategy')}</strong>{' '}
                    {t('brandStrategyDesc')}
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">{t('localMarketExpertise')}</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>{t('istanbulMarket')}</strong>{' '}
                    {t('istanbulMarketDesc')}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>{t('culturalSensitivity')}</strong>{' '}
                    {t('culturalSensitivityDesc')}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>{t('competitiveAnalysis')}</strong>{' '}
                    {t('competitiveAnalysisDesc')}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>{t('localBusinessFocus')}</strong>{' '}
                    {t('localBusinessFocusDesc')}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="w-full bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              {t('processHeading')}
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              {t('processDescription')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">{t('discovery')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('discoveryDesc')}
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">{t('concept')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('conceptDesc')}
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">{t('refinement')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('refinementDesc')}
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">{t('delivery')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('deliveryDesc')}
              </p>
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
