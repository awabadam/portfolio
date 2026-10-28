import { CASE_STUDIES, CLIENT_WORK } from "@/data/case-studies";
import { BRAND_STUDIES, BRAND_WORK } from "@/data/brand-studies";
import { projectTiers, carePlans, brandKit, formatPrice, formatPlanPrice, getBrandKitBundlePrice, getTier } from "@/lib/pricing";
import en from "@/messages/en.json";

// /llms.txt (https://llmstxt.org): a plain-text map of the site for AI agents.
// Prices and case studies are read from their source files so this never drifts.
export const dynamic = "force-static";

const SITE = "https://www.awab.design";

export function GET() {
  const pkg = en.packages as Record<string, unknown>;

  const tiers = projectTiers
    .map((t) => `- ${pkg[t.nameKey]}: from ${formatPrice(t.price)}. ${pkg[t.descKey]}`)
    .join("\n");
  const care = carePlans
    .map((p) => `- ${pkg[p.nameKey]}: ${formatPlanPrice(p)}/month. ${pkg[p.descKey]}`)
    .join("\n");
  const brandKitFeatures = (pkg[brandKit.featuresKey] as string[]).map((f) => `  - ${f}`).join("\n");
  const bundleTier = getTier(brandKit.bundle.withTier);
  const work = CLIENT_WORK.filter((id) => CASE_STUDIES[id])
    .map((id) => `- [${id}](${SITE}/projects/${id}): ${CASE_STUDIES[id].headline}`)
    .join("\n");
  const brandWork = BRAND_WORK.filter((id) => BRAND_STUDIES[id])
    .map((id) => `- [${id}](${SITE}/projects/${id}): ${BRAND_STUDIES[id].client} (${BRAND_STUDIES[id].year}). ${BRAND_STUDIES[id].headline}`)
    .join("\n");

  const body = `# Awab Design

> ${en.metadata.home.description}

Awab Elkhalil designs and builds websites for dental, aesthetic and hair transplant clinics in Istanbul that treat patients from abroad. Sites are multilingual (English, Turkish, Arabic with full right-to-left layout, French), route enquiries to WhatsApp, and track which countries and ad campaigns bring patients. He also designs clinic brands: the logo, before-and-after social media templates and a WhatsApp kit for patient coordinators. Prices are in USD.

## Pages

- [Home](${SITE}/): overview, selected work, process
- [Services](${SITE}/services): what is included in a clinic website
- [Pricing](${SITE}/pricing): packages, care plans and what each includes
- [Website maintenance](${SITE}/services/website-maintenance): monthly care plans
- [Clinic branding](${SITE}/services/clinic-branding): the ${pkg[brandKit.nameKey]}, with logo, social templates and a WhatsApp kit
- [Web design Istanbul](${SITE}/webdesign-istanbul): local service page
- [Projects](${SITE}/projects): case studies
- [Free clinic website audit](${SITE}/audit): short questionnaire that returns a written report
- [Blog](${SITE}/blog): articles on clinic marketing and websites
- [About](${SITE}/about)
- [Contact](${SITE}/contact): contact form, or email hello@awab.design

## Packages

${tiers}

## Care plans

${care}

## Clinic branding

- ${pkg[brandKit.nameKey]}: from ${formatPrice(brandKit.price)}. ${pkg[brandKit.descKey]} ${pkg[brandKit.timeframeKey]}.
${brandKitFeatures}
- ${pkg[bundleTier.nameKey]} + ${pkg[brandKit.nameKey]}: ${formatPrice(getBrandKitBundlePrice())} for both, ${formatPrice(brandKit.bundle.discount)} less than buying them separately.

## Case studies

${work}

## Brand work

${brandWork}

## Languages

Every page is available at ${SITE}/ (English), ${SITE}/tr, ${SITE}/ar and ${SITE}/fr.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
