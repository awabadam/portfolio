import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  Globe,
  FileText,
  MessageCircle,
  BarChart3,
  Inbox,
  Share2,
  Target,
  Bot,
  Search,
  Server,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/effects";
import { GlassPill } from "@/components/ui/glass-pill";
// 💰 Pricing source of truth: edit prices in src/lib/pricing.ts
// Same component as /pricing, so both pages show identical packages.
import PackageCards from "@/components/pricing/PackageCards";
import { getTier, getCarePlan, formatPrice } from "@/lib/pricing";
import FAQSchema from "@/components/seo/FAQSchema";
import StockPhoto from "@/components/ui/stock-photo";
import AuditCta from "@/components/audit/AuditCta";
import RelatedLinks from "@/components/seo/RelatedLinks";
import { CASE_STUDIES } from "@/data/case-studies";

export const revalidate = 60;

// dubs-style grey inline link: muted at rest, full foreground on hover.
const GREY_LINK =
  "inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground";

// Deliverables, one per feature line on the pricing page. `pkg` is the
// `packages` key of the package (or monthly plan) that includes it, so the
// label under each item always matches what /pricing sells.
const deliverables = [
  { key: "capMultilang", pkg: "clinicWebsite", icon: Globe },
  { key: "capTreatments", pkg: "clinicWebsite", icon: FileText },
  { key: "capWhatsapp", pkg: "clinicWebsite", icon: MessageCircle },
  { key: "capTracking", pkg: "clinicWebsite", icon: BarChart3 },
  { key: "capSeo", pkg: "clinicWebsite", icon: Search },
  { key: "capLeadPanel", pkg: "growthSystem", icon: Inbox },
  { key: "capCrm", pkg: "growthSystem", icon: Share2 },
  { key: "capAdsConversions", pkg: "growthSystem", icon: Target },
  { key: "capAssistant", pkg: "growthSystem", icon: Bot },
  { key: "capHosting", pkg: "siteCare", icon: Server },
] as const;

const processSteps = ["process1", "process2", "process3", "process4"] as const;

// The three clinic case studies (src/data/case-studies.ts). Display names
// match the homepage client row.
const clinicProjects = [
  { id: "saphiredent", name: "SaphireDent" },
  { id: "jouvence", name: "Jouvence" },
  { id: "esteexpert", name: "EsteExpert" },
] as const;

const faqKeys = ["faq1", "faq2", "faq3", "faq4", "faq5", "faq6", "faq7", "faq8", "faq9", "faq10"] as const;

type CompareRow = { label: string; agency: string; me: string };

export default async function ServicesPage() {
  const t = await getTranslations("services");
  const tPackages = await getTranslations("packages");
  const locale = await getLocale();

  // FAQ answers quote package and plan prices from pricing.ts.
  const clinicTier = getTier("business");
  const growthTier = getTier("custom");
  const siteCare = getCarePlan("careStandard");
  const priceValues = {
    clinicPrice: formatPrice(clinicTier.price),
    growthPrice: formatPrice(growthTier.price),
    carePrice: formatPrice(siteCare.price),
  };

  const compareRows = t.raw("compare.rows") as CompareRow[];
  const faqItems = faqKeys.map((key) => ({
    question: t(`${key}Q`),
    answer: t(`${key}A`, priceValues),
  }));

  // JSON-LD: the clinic website service, with the entry price.
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("heading"),
    serviceType: "Medical Clinic Website Design",
    description: t("description"),
    inLanguage: locale,
    url: "https://www.awab.design/services",
    provider: {
      "@type": "Person",
      name: "Awab Elkhalil",
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
    ],
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Dental, aesthetic, hair transplant and medical tourism clinics",
    },
    offers: [clinicTier, growthTier].map((tier) => ({
      "@type": "Offer",
      name: tPackages(tier.nameKey),
      price: String(tier.price),
      priceCurrency: "USD",
      url: "https://www.awab.design/pricing",
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <FAQSchema items={faqItems} />

      <main className="min-h-screen bg-background pt-32">
        {/* Hero */}
        <section className="container grid items-center gap-10 px-5 pb-20 md:px-8 md:pb-28 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ScrollReveal animation="fadeUp">
              <p className="mb-5 font-mono text-label text-muted-foreground">{t("heroEyebrow")}</p>
              <h1 className="font-display text-hero text-balance">{t("heading")}</h1>
            </ScrollReveal>
            <ScrollReveal animation="fadeUp" delay={0.1}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                {t("description")}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                <GlassPill href="/audit" tone="dark" arrow className="h-12 px-6 text-base">
                  {t("heroCtaAudit")}
                </GlassPill>
                <Link href="/pricing" className={GREY_LINK}>
                  {t("heroCtaPackages")}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 rtl:-scale-x-100" />
                </Link>
              </div>
              <p className="mt-8 flex max-w-md items-center gap-3 text-sm text-muted-foreground">
                <Image
                  src="/img/awab-portrait.webp"
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-border"
                />
                {t("heroNote")}
              </p>
            </ScrollReveal>
          </div>
          <ScrollReveal animation="fade" delay={0.15} className="lg:col-span-5">
            <StockPhoto
              slot="clinic-interior"
              priority
              // Landscape photo in a 4:5 frame: object-cover renders it ~1.7x the
              // frame width, so request that width or it gets upscaled (blurry).
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="aspect-[4/3] lg:aspect-[4/5]"
              imageClassName="object-[50%_40%]"
            />
          </ScrollReveal>
        </section>

        {/* What you get */}
        <section className="border-t border-border/60 py-20 md:py-28">
          <div className="container px-5 md:px-8">
            <ScrollReveal animation="fadeUp" className="mb-10 max-w-2xl md:mb-14">
              <p className="mb-4 font-mono text-label text-muted-foreground">{t("deliverablesHeading")}</p>
              <h2 className="font-display text-heading text-balance">{t("deliverablesSubtitle")}</h2>
            </ScrollReveal>
            <StaggerContainer
              className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5"
              staggerDelay={0.05}
            >
              {deliverables.map(({ key, pkg, icon: Icon }) => (
                <StaggerItem key={key} animation="fadeUp">
                  <div className="flex h-full flex-col border-t border-border/60 pt-5">
                    <Icon aria-hidden="true" className="h-5 w-5 text-foreground" />
                    <h3 className="mt-4 font-display text-xl leading-snug tracking-tight">{t(key)}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {t(`${key}Desc`)}
                    </p>
                    <p className="mt-4 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                      {t("deliverablesIn", { package: tPackages(pkg) })}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border/60 py-20 md:py-28">
          <div className="container grid gap-10 px-5 md:px-8 lg:grid-cols-12 lg:gap-14">
            <ScrollReveal animation="fade" className="lg:col-span-5">
              <StockPhoto
                slot="dentist-scan"
                // 4:3 photo: in the 4:5 frame it renders ~1.67x the frame width.
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="aspect-[4/3] lg:sticky lg:top-32 lg:aspect-[4/5]"
                imageClassName="object-[60%_50%]"
              />
            </ScrollReveal>
            <div className="lg:col-span-7">
            <ScrollReveal animation="fadeUp" className="mb-10 max-w-2xl md:mb-14">
              <p className="mb-4 font-mono text-label text-muted-foreground">{t("processHeading")}</p>
              <h2 className="font-display text-heading text-balance">{t("processSubtitle")}</h2>
            </ScrollReveal>
            <StaggerContainer className="grid gap-x-8 gap-y-10 sm:grid-cols-2" staggerDelay={0.1}>
              {processSteps.map((step, i) => (
                <StaggerItem key={step} animation="fadeUp">
                  <div className="border-t border-border/60 pt-5">
                    <span className="font-mono text-[11px] text-muted-foreground">0{i + 1}</span>
                    <h3 className="mt-4 font-display text-2xl leading-tight tracking-tight">{t(`${step}Title`)}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(`${step}Desc`)}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
            </div>
          </div>
        </section>

        {/* Why a specialist, not an agency (dark band) */}
        <section className="bg-black py-20 text-white md:py-28">
          <div className="container px-5 md:px-8">
            <ScrollReveal animation="fadeUp" className="max-w-3xl">
              <p className="mb-4 font-mono text-label text-white/60">{t("compare.eyebrow")}</p>
              <h2 className="font-display text-heading text-balance">{t("compare.heading")}</h2>
              <p className="mt-5 max-w-2xl text-base text-white/60 md:text-lg">{t("compare.intro")}</p>
            </ScrollReveal>

            <div className="mt-12 md:mt-16" role="table" aria-label={t("compare.eyebrow")}>
              <div role="row" className="hidden grid-cols-12 gap-6 border-b border-white/20 pb-4 md:grid">
                <p role="columnheader" className="col-span-3 font-mono text-[11px] uppercase tracking-wide text-white/50">
                  {t("compare.colLabel")}
                </p>
                <p role="columnheader" className="col-span-4 font-mono text-[11px] uppercase tracking-wide text-white/50">
                  {t("compare.colAgency")}
                </p>
                <p role="columnheader" className="col-span-5 font-mono text-[11px] uppercase tracking-wide text-white">
                  {t("compare.colMe")}
                </p>
              </div>
              {compareRows.map((row, i) => (
                <ScrollReveal key={row.label} animation="fadeUp" delay={i * 0.04}>
                  <div
                    role="row"
                    className="grid gap-3 border-b border-white/15 py-6 md:grid-cols-12 md:gap-6 md:py-7"
                  >
                    <h3 role="rowheader" className="font-display text-xl leading-snug tracking-tight md:col-span-3 md:text-2xl">
                      {row.label}
                    </h3>
                    <div role="cell" className="md:col-span-4">
                      <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-white/50 md:hidden">
                        {t("compare.colAgency")}
                      </p>
                      <p className="text-sm leading-relaxed text-white/55 md:text-[15px]">{row.agency}</p>
                    </div>
                    <div role="cell" className="md:col-span-5">
                      <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-white md:hidden">
                        {t("compare.colMe")}
                      </p>
                      <p className="text-sm leading-relaxed text-white md:text-[15px]">{row.me}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal animation="fadeUp" className="mt-10 flex flex-col gap-6 md:mt-12 md:flex-row md:items-center md:justify-between">
              <p className="max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">{t("compare.note")}</p>
              <GlassPill href="/audit" tone="light" arrow className="h-12 shrink-0 self-start px-6 text-base md:self-auto">
                {t("heroCtaAudit")}
              </GlassPill>
            </ScrollReveal>
          </div>
        </section>

        {/* Packages */}
        <section className="py-20 md:py-28">
          <div className="container px-5 md:px-8">
            <ScrollReveal animation="fadeUp" className="mb-10 max-w-2xl md:mb-14">
              <p className="mb-4 font-mono text-label text-muted-foreground">{t("pricingHeading")}</p>
              <h2 className="font-display text-heading text-balance">{t("pricingSubtitle")}</h2>
            </ScrollReveal>

            <PackageCards />

            <div className="mt-8 md:mt-10">
              <Link href="/pricing" className={GREY_LINK}>
                {t("pricingCompare")}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 rtl:-scale-x-100" />
              </Link>
            </div>
          </div>
        </section>

        {/* Proven on real clinic sites */}
        <section className="border-t border-border/60 py-20 md:py-28">
          <div className="container px-5 md:px-8">
            <ScrollReveal animation="fadeUp" className="mb-10 max-w-2xl md:mb-14">
              <p className="mb-4 font-mono text-label text-muted-foreground">{t("proof.heading")}</p>
              <h2 className="font-display text-heading text-balance">{t("proof.subtitle")}</h2>
            </ScrollReveal>
            <StaggerContainer className="grid gap-8 md:grid-cols-3 md:gap-6" staggerDelay={0.1}>
              {clinicProjects.map(({ id, name }) => {
                const study = CASE_STUDIES[id];
                return (
                  <StaggerItem key={id} animation="fadeUp">
                    <Link href={`/projects/${id}`} className="group flex h-full flex-col">
                      <div className="relative aspect-[16/11] overflow-hidden rounded-[10px] bg-neutral-900">
                        <Image
                          src={`/img/projects/${id}/home.webp`}
                          alt={name}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          quality={85}
                          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                      </div>
                      <p className="mt-5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                        {name} · {t(`proof.markets.${study.market}`)} ·{" "}
                        {t("proof.languages", { count: study.languages.length })}
                      </p>
                      <h3 className="mt-3 flex-1 font-display text-xl leading-snug tracking-tight md:text-2xl">
                        {study.headline}
                      </h3>
                      <span className={`${GREY_LINK} mt-5 group-hover:text-foreground`}>
                        {t("proof.link")}
                        <ArrowUpRight aria-hidden="true" className="h-4 w-4 rtl:-scale-x-100" />
                      </span>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border/60 py-20 md:py-28">
          <div className="container grid gap-10 px-5 md:px-8 lg:grid-cols-12 lg:gap-14">
            <ScrollReveal animation="fadeUp" className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <p className="mb-4 font-mono text-label text-muted-foreground">{t("faqHeading")}</p>
                <h2 className="font-display text-heading text-balance">{t("faqSubtitle")}</h2>
              </div>
            </ScrollReveal>
            <div className="divide-y divide-border/60 border-t border-border/60 lg:col-span-8">
              {faqItems.map((item) => (
                <details key={item.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-start font-display text-lg leading-snug tracking-tight md:text-xl [&::-webkit-details-marker]:hidden">
                    <span>{item.question}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Internal links: pricing, audit, proof */}
        <div className="container mx-auto px-5 pb-20 md:px-8">
          <RelatedLinks items={["pricing", "audit", "caseStudies"]} />
        </div>

        {/* Final CTA: the free audit */}
        <AuditCta variant="services" location="services_footer" />
      </main>
    </>
  );
}
