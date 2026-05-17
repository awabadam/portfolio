import React from "react";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  DollarSign,
  Zap,
  Globe,
  Shield,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.webdesign");
  const locale = await getLocale();
  const ogLocale =
    locale === "ar" ? "ar_SA" : locale === "tr" ? "tr_TR" : "en_US";

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "webdesign Istanbul",
      "website design Istanbul",
      "web development Istanbul",
      "responsive web design Istanbul",
      "Istanbul web designer",
      "professional website Istanbul",
      "custom website Istanbul",
      "web tasarım istanbul",
      "istanbul web sitesi",
      "kurumsal web tasarım",
      "profesyonel web sitesi",
      "web designer turkey",
      "freelance web designer istanbul",
      "web agency istanbul",
      "website development turkey",
      "modern web design istanbul",
      "Next.js developer Istanbul",
      "React developer Istanbul",
    ],
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://www.awab.design/services/webdesign-istanbul",
      locale: ogLocale,
    },
    alternates: {
      canonical: "/services/webdesign-istanbul",
      languages: {
        en: "/services/webdesign-istanbul",
        ar: "/ar/services/webdesign-istanbul",
        tr: "/tr/services/webdesign-istanbul",
        fr: "/fr/services/webdesign-istanbul",
      },
    },
  };
}

const faqItems = [
  {
    question: "How much does web design cost in Istanbul?",
    answer:
      "Web design prices in Istanbul range from $150 for a landing page to $3,000+ for custom projects. At Awab Design, business websites start at $500 with no hidden fees. We offer transparent pricing and a free quote calculator.",
  },
  {
    question: "How long does it take to build a website in Istanbul?",
    answer:
      "A landing page takes about 1 week, a business website 2-4 weeks, and custom projects 4-8 weeks. We use Next.js for faster development and better performance than traditional WordPress sites.",
  },
  {
    question: "Do you build websites in Turkish and English?",
    answer:
      "Yes. Every website we build supports multiple languages including Turkish, English, Arabic, and French. Multilingual sites are essential for Istanbul businesses targeting both local and international customers.",
  },
  {
    question:
      "What makes your web design different from other Istanbul agencies?",
    answer:
      "We build with Next.js instead of WordPress, delivering sites that load in under 1 second vs 3-8 seconds. No templates, no plugins — custom code that's faster, more secure, and ranks better on Google.",
  },
  {
    question: "Do you provide SEO services with web design?",
    answer:
      "Yes, every website includes SEO setup: optimized structure, meta tags, fast loading speeds, sitemap, and Google Search Console configuration. Advanced SEO packages are available for ongoing optimization.",
  },
  {
    question: "Can you build a website for my clinic in Istanbul?",
    answer:
      "Absolutely. Medical clinic websites are our specialty. We've built multilingual sites for aesthetic clinics, dental clinics, and medical tourism businesses with KVKK compliance, WhatsApp booking, and patient galleries.",
  },
  {
    question: "Do you work with businesses outside Istanbul?",
    answer:
      "Yes, we work remotely with clients worldwide including Turkey, Middle East, Europe, and North America. All communication via email, WhatsApp, and video calls.",
  },
  {
    question:
      "Why should I choose Next.js over WordPress for my Istanbul business?",
    answer:
      "Next.js sites load 3-5x faster, have zero plugin vulnerabilities, cost less to maintain, and rank better on Google. For Istanbul's competitive market, speed and SEO advantages give you a significant edge over WordPress competitors.",
  },
  {
    question: "What is included in your web design packages?",
    answer:
      "Every package includes custom responsive design, SEO optimization, SSL certificate, contact forms, analytics setup, mobile optimization, and 2-3 revision rounds. Hosting, domain, and maintenance plans also available.",
  },
  {
    question: "Do you offer website maintenance after launch?",
    answer:
      "Yes, we offer ongoing maintenance starting at $150/month covering security updates, performance optimization, content changes, and monthly reports. You're never left alone after launch.",
  },
];

const WebdesignIstanbulPage = async () => {
  const t = await getTranslations("services");
  const inclusions = t.raw("webdesign.inclusions") as string[];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("webdesign.title"),
    description: t("webdesign.lead"),
    provider: {
      "@type": "Person",
      name: "Awab Design",
      url: "https://www.awab.design",
    },
    areaServed: [
      { "@type": "City", name: "Istanbul" },
      { "@type": "AdministrativeArea", name: "Besiktas, Istanbul" },
      { "@type": "AdministrativeArea", name: "Kadikoy, Istanbul" },
      { "@type": "AdministrativeArea", name: "Sisli, Istanbul" },
      { "@type": "AdministrativeArea", name: "Atasehir, Istanbul" },
      { "@type": "AdministrativeArea", name: "Bakirkoy, Istanbul" },
      { "@type": "AdministrativeArea", name: "Beyoglu, Istanbul" },
      { "@type": "AdministrativeArea", name: "Uskudar, Istanbul" },
      { "@type": "AdministrativeArea", name: "Maslak, Istanbul" },
      { "@type": "Country", name: "Turkey" },
    ],
    offers: {
      "@type": "Offer",
      price: "150",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "150",
        priceCurrency: "USD",
        unitText: "project",
      },
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main className="min-h-screen bg-background pt-32">
        <div className="container mx-auto px-4 py-16">
          <Link
            href="/services"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("backToServices")}
          </Link>

          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="mb-6 font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              {t("webdesign.heading")}
            </h1>
            <p className="lead mb-8 max-w-3xl text-2xl leading-relaxed text-muted-foreground md:text-3xl">
              {t("webdesign.lead")}
            </p>

            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-xl font-semibold text-primary">
                  {t("webdesign.pricing")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg text-muted-foreground">
                  {t("webdesign.deliveryTime")}
                </span>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <section className="mb-16">
            <h2 className="mb-8 font-display text-3xl font-bold">
              {t("whatsIncluded")}
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

          {/* Why Choose Awab Design */}
          <section className="mb-16">
            <h2 className="mb-8 font-display text-3xl font-bold">
              Why Choose Awab Design for Web Design in Istanbul
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <Zap className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-display text-lg font-bold">
                  Blazing Fast
                </h3>
                <p className="text-sm text-muted-foreground">
                  Next.js sites load in under 1 second. 3-5x faster than
                  WordPress.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <Globe className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-display text-lg font-bold">
                  Multilingual
                </h3>
                <p className="text-sm text-muted-foreground">
                  Reach local and international audiences in TR/EN/AR/FR.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <Shield className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-display text-lg font-bold">
                  Secure & Maintained
                </h3>
                <p className="text-sm text-muted-foreground">
                  No WordPress vulnerabilities. Ongoing security updates.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <TrendingUp className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-display text-lg font-bold">
                  SEO Optimized
                </h3>
                <p className="text-sm text-muted-foreground">
                  Built for Google from day one. Structured data, fast loads,
                  mobile-first.
                </p>
              </div>
            </div>
          </section>

          {/* Istanbul Web Design Portfolio */}
          <section className="mb-16">
            <h2 className="mb-4 font-display text-3xl font-bold">
              Istanbul Web Design Portfolio
            </h2>
            <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
              See how we have helped Istanbul businesses grow online with custom
              websites that convert visitors into customers.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/projects"
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <div className="mb-3 flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold">
                    Clinic Websites
                  </h3>
                  <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Multilingual medical and aesthetic clinic websites with patient
                  booking, galleries, and KVKK compliance for Istanbul
                  healthcare providers.
                </p>
              </Link>
              <Link
                href="/projects"
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <div className="mb-3 flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold">
                    E-Commerce
                  </h3>
                  <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  High-performance online stores with Turkish payment
                  integrations, fast product pages, and mobile-first shopping
                  experiences.
                </p>
              </Link>
              <Link
                href="/projects"
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <div className="mb-3 flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold">
                    Corporate Sites
                  </h3>
                  <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Professional corporate websites for Istanbul businesses with
                  brand storytelling, team pages, and lead generation forms.
                </p>
              </Link>
            </div>
          </section>

          {/* Next.js vs WordPress Comparison */}
          <section className="mb-16">
            <h2 className="mb-8 font-display text-3xl font-bold">
              Web Design Istanbul: Next.js vs WordPress
            </h2>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 font-display text-sm font-bold">
                      Feature
                    </th>
                    <th className="px-6 py-4 font-display text-sm font-bold text-primary">
                      Next.js (Awab Design)
                    </th>
                    <th className="px-6 py-4 font-display text-sm font-bold text-muted-foreground">
                      WordPress
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium">
                      Load Speed
                    </td>
                    <td className="px-6 py-4 text-sm text-primary">
                      &lt;1 second
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      3-8 seconds
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium">Security</td>
                    <td className="px-6 py-4 text-sm text-primary">
                      No plugins/vulnerabilities
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      Regular exploits
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium">SEO</td>
                    <td className="px-6 py-4 text-sm text-primary">
                      Built-in optimization
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      Plugin-dependent
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium">
                      Maintenance Cost
                    </td>
                    <td className="px-6 py-4 text-sm text-primary">
                      Lower long-term
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      Ongoing plugin updates
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium">
                      Custom Design
                    </td>
                    <td className="px-6 py-4 text-sm text-primary">
                      100% custom
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      Template-based
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium">Mobile</td>
                    <td className="px-6 py-4 text-sm text-primary">
                      Mobile-first responsive
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      Often problematic
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Process */}
          <section className="mb-16">
            <h2 className="mb-8 font-display text-3xl font-bold">
              {t("ourProcess")}
            </h2>
            <div className="grid gap-8 md:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="border-t border-border pt-6">
                  <span className="mb-2 block font-mono text-sm text-muted-foreground">
                    {t(`webdesign.phase${n}Step`)}
                  </span>
                  <h3 className="mb-2 font-display text-xl font-bold">
                    {t(`webdesign.phase${n}Title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(`webdesign.phase${n}Desc`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="mb-8 font-display text-3xl font-bold">
              Frequently Asked Questions About Web Design in Istanbul
            </h2>
            <div className="divide-y divide-border rounded-xl border border-border">
              {faqItems.map((item) => (
                <div key={item.question} className="p-6">
                  <h3 className="mb-3 font-display text-lg font-bold">
                    {item.question}
                  </h3>
                  <p className="text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>


          {/* CTA */}
          <section className="rounded-2xl border border-border bg-muted/30 p-12 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold">
              {t("webdesign.ctaHeading")}
            </h2>
            <p className="mb-8 text-muted-foreground">
              {t("webdesign.ctaDescription")}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-14 px-8 text-lg">
                <Link href="/rate-calculator">{t("getQuote")}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg"
              >
                <Link href="/contact">{t("contactMe")}</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default WebdesignIstanbulPage;
