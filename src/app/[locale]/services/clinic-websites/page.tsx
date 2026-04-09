import React from "react";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  MessageCircle,
  Calendar,
  Image as ImageIcon,
  UserCheck,
  ShieldCheck,
  Zap,
  Search,
  ChevronDown,
} from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import FAQSchema from "@/components/seo/FAQSchema";
import { getAllProjects } from "@/data/projects";
import ClinicProjectCard from "@/components/clinic/ClinicProjectCard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.clinicWebsites");
  const locale = await getLocale();
  const ogLocale =
    locale === "ar"
      ? "ar_SA"
      : locale === "tr"
        ? "tr_TR"
        : locale === "fr"
          ? "fr_FR"
          : "en_US";

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "medical clinic website design istanbul",
      "clinic website design turkey",
      "aesthetic clinic web design",
      "medical tourism website",
      "multilingual clinic website",
      "dental clinic website istanbul",
      "hair transplant clinic website",
      "klinik web sitesi tasarımı",
      "estetik klinik web sitesi",
      "sağlık turizmi web sitesi",
      "next.js clinic website",
    ],
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://www.awab.design/services/clinic-websites",
      locale: ogLocale,
      type: "website",
    },
    alternates: {
      canonical: "/services/clinic-websites",
      languages: {
        en: "/services/clinic-websites",
        ar: "/ar/services/clinic-websites",
        tr: "/tr/services/clinic-websites",
        fr: "/fr/services/clinic-websites",
      },
    },
  };
}

const features = [
  { key: "feature1", icon: Globe },
  { key: "feature2", icon: MessageCircle },
  { key: "feature3", icon: Calendar },
  { key: "feature4", icon: ImageIcon },
  { key: "feature5", icon: UserCheck },
  { key: "feature6", icon: ShieldCheck },
  { key: "feature7", icon: Zap },
  { key: "feature8", icon: Search },
];

const processSteps = ["process1", "process2", "process3", "process4"];

const faqKeys = [
  "faq1",
  "faq2",
  "faq3",
  "faq4",
  "faq5",
  "faq6",
  "faq7",
  "faq8",
  "faq9",
  "faq10",
];

export default async function ClinicWebsitesPage() {
  const t = await getTranslations("clinicWebsites");
  const tBreadcrumbs = await getTranslations("clinicWebsites");

  // Grab the 2 clinic projects from projects data
  const allProjects = await getAllProjects();
  const clinicProjects = allProjects.filter(
    (p) => p.id === "jouvence" || p.id === "esteexpert"
  );

  // JSON-LD: Service + areaServed
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Medical Clinic Website Design",
    serviceType: "Medical Clinic Website Design",
    description: t("heroSubtitle"),
    provider: {
      "@type": "Person",
      name: "Awab Design",
      url: "https://www.awab.design",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Istanbul",
        addressCountry: "TR",
      },
    },
    areaServed: [
      { "@type": "City", name: "Istanbul" },
      { "@type": "Country", name: "Turkey" },
      { "@type": "Place", name: "Worldwide" },
    ],
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Medical Clinics, Aesthetic Clinics, Dental Clinics, Health Tourism",
    },
    offers: {
      "@type": "Offer",
      price: "1500",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "1500",
        priceCurrency: "USD",
        unitText: "project",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <FAQSchema
        items={faqKeys.map((key) => ({
          question: t(`${key}Q`),
          answer: t(`${key}A`),
        }))}
      />
      <Breadcrumbs
        items={[
          { name: tBreadcrumbs("breadcrumbHome"), url: "/" },
          { name: tBreadcrumbs("breadcrumbServices"), url: "/services" },
          {
            name: tBreadcrumbs("breadcrumbClinic"),
            url: "/services/clinic-websites",
          },
        ]}
      />

      <main className="min-h-screen bg-background pt-32">
        {/* Back link */}
        <div className="container mx-auto px-4">
          <Link
            href="/services"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {tBreadcrumbs("breadcrumbServices")}
          </Link>
        </div>

        {/* Hero */}
        <section className="container mx-auto px-4 pb-16">
          <p className="mb-4 font-mono text-sm uppercase tracking-widest text-muted-foreground">
            {t("heroEyebrow")}
          </p>
          <h1 className="max-w-4xl font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            {t("heroHeading")}
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
            {t("heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="h-14 rounded-full px-8 text-base">
              <Link href="/contact">
                {t("heroCTA")}
                <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 rounded-full px-8 text-base"
            >
              <Link href="/projects">{t("heroCTASecondary")}</Link>
            </Button>
          </div>
        </section>

        {/* Problem statement */}
        <section className="border-t border-border py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-6 font-display text-3xl font-bold leading-tight md:text-4xl">
                {t("problemHeading")}
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t("problemText")}
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border py-24">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-2 font-display text-3xl font-bold md:text-4xl">
                {t("featuresHeading")}
              </h2>
              <p className="text-muted-foreground">{t("featuresSubtitle")}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ key, icon: Icon }) => (
                <div
                  key={key}
                  className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="mb-4 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-bold">
                    {t(`${key}Title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(`${key}Desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured clinic projects */}
        {clinicProjects.length > 0 && (
          <section className="border-t border-border py-24">
            <div className="container mx-auto px-4">
              <div className="mb-12 text-center">
                <h2 className="mb-2 font-display text-3xl font-bold md:text-4xl">
                  {t("projectsHeading")}
                </h2>
                <p className="text-muted-foreground">{t("projectsSubtitle")}</p>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                {clinicProjects.map((project) => (
                  <ClinicProjectCard
                    key={project.id}
                    project={project}
                    viewCaseStudyLabel={t("viewCaseStudy")}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Process */}
        <section className="border-t border-border py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-16 text-center font-display text-3xl font-bold md:text-4xl">
              {t("processHeading")}
            </h2>
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, i) => (
                <div key={step}>
                  <div className="mb-4 font-mono text-4xl font-bold text-primary/20">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mb-2 font-display text-xl font-bold">
                    {t(`${step}Title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(`${step}Desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-2 font-display text-3xl font-bold md:text-4xl">
                {t("faqHeading")}
              </h2>
              <p className="text-muted-foreground">{t("faqSubtitle")}</p>
            </div>
            <div className="mx-auto max-w-3xl divide-y divide-border">
              {faqKeys.map((key) => (
                <details key={key} className="group py-5">
                  <summary className="flex cursor-pointer items-center justify-between text-lg font-medium">
                    <span>{t(`${key}Q`)}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-muted-foreground">{t(`${key}A`)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
              {t("ctaHeading")}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              {t("ctaSubtitle")}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-full px-8 text-base"
              >
                <Link href="/contact">
                  {t("ctaPrimary")}
                  <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-full px-8 text-base"
              >
                <Link href="/pricing">{t("ctaSecondary")}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
