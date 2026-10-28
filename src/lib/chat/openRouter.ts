import { ChatMessage, ChatContext } from "./chatBot";
import { services, projects, businessInfo, faqs } from "./knowledgeBase";
// 💰 Pricing source of truth: edit prices in src/lib/pricing.ts
// The chat assistant's pricing answers are generated from this data.
import { projectTiers, carePlans, brandKit, formatPrice, formatPlanPrice, getIncludedAddOns, getBrandKitBundlePrice, includedCareMonths } from "@/lib/pricing";

export interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Constants for context management
const MAX_CONTEXT_MESSAGES = 20; // Maximum messages to keep
const MAX_TOTAL_CHARS = 8000; // Approximate character limit for context
const PRIORITY_MESSAGE_COUNT = 4; // Always keep the last N messages

/**
 * Builds a system prompt with knowledge base information
 */
function buildSystemPrompt(context: ChatContext, locale?: string): string {
  const loc = locale || "en";

  // Build pricing (one USD price list for every locale). English names match the `packages` namespace.
  const tierNames: Record<string, string> = {
    business: "Clinic Website",
    custom: "Clinic Growth System",
  };
  const planNames: Record<string, string> = {
    careStandard: "Site Care",
    carePro: "Growth Retainer",
  };
  const tierPrices = projectTiers.map((t) =>
    `${tierNames[t.id] ?? t.id}: from ${formatPrice(t.price)}`
  ).join(", ");
  const planPrices = carePlans.map((p) =>
    `${planNames[p.id] ?? p.id}: ${formatPlanPrice(p)}/mo`
  ).join(", ");
  const brandKitName = "Clinic Brand Kit";
  const bundleName = `${tierNames[brandKit.bundle.withTier]} + ${brandKitName}`;

  const addOnLabels: Record<string, string> = {
    seo: "SEO setup with medical schema",
    blog: "Blog",
    cms: "Admin panel (CMS)",
    chatbot: "AI patient assistant",
    multilang: "Multilingual setup",
  };
  const bundles = projectTiers.map((t) =>
    `${tierNames[t.id] ?? t.id}: ${getIncludedAddOns(t.id).map((a) => addOnLabels[a.id] ?? a.id).join(", ")}`
  ).join("; ");

  // Build project showcase
  const projectList = projects
    .map((p) => `${p.name} (${p.category})${p.results ? " — " + p.results[0] : ""}`)
    .join("; ");

  let contextInfo = "";
  if (context.visitorName) contextInfo += `\nVisitor's name: ${context.visitorName}`;
  if (context.visitorEmail) contextInfo += `\nVisitor's email: ${context.visitorEmail}`;
  if (context.visitorPhone) contextInfo += `\nVisitor's phone: ${context.visitorPhone}`;

  const langMap: Record<string, string> = { ar: "Arabic", tr: "Turkish", fr: "French" };
  const langInstruction = loc !== "en" && langMap[loc]
    ? `Reply in ${langMap[loc]}. Keep brand names and tech terms in English.`
    : "";

  return `You are Awab Design's assistant. Brief, friendly, helpful. 2-3 sentences max. Plain text only.
${langInstruction ? `\n${langInstruction}` : ""}
About: Builds patient-acquisition websites for Istanbul clinics that treat international patients (dental, aesthetic, hair, medical tourism), and designs their brand: logo, social media templates and the WhatsApp kit patients see before they book. Based in Istanbul. Speaks English, Arabic, Turkish, French.
Email: ${businessInfo.email} | WhatsApp: ${businessInfo.phone}

PRICING (USD, same prices in every language and country):
Packages: ${tierPrices}
Monthly plans: ${planPrices}. The first ${includedCareMonths} months of the matching plan come free with each package (Site Care with Clinic Website, Growth Retainer with Growth System).
Bundled free in each package (website add-ons are not sold separately): ${bundles}
${brandKitName}: from ${formatPrice(brandKit.price)}, ready in 2-3 weeks. ${bundleName}: ${formatPrice(getBrandKitBundlePrice())} for both, ${formatPrice(brandKit.bundle.discount)} less than buying them separately.
Pricing details: /pricing

SERVICES: Two packages for clinics. Clinic Website: site in up to 3 languages, a page per treatment, WhatsApp button on every treatment page, tracking for WhatsApp clicks, forms and calls. Clinic Growth System: everything in Clinic Website plus 6+ languages including Arabic (RTL), admin panel for the clinic team, AI patient assistant, every inquiry saved with the patient's country, CRM handoff, and Google Ads offline-conversion export so the clinic sees which ads bring patients. Site Care covers hosting, domain, SSL, security and small changes; Growth Retainer adds a monthly lead report, ads-tracking upkeep and new treatment/campaign pages. ${brandKitName} (design service for the same clinics): a new logo or a refresh of the current one, colours, fonts and a short brand guide, before-and-after post and story templates for every treatment, a WhatsApp kit for each coordinator (profile picture, contact card, stories), a quote and price-list template for WhatsApp, Instagram and Facebook profile and cover images, all files in AI, SVG, PNG and PDF with two rounds of changes. The clinic's team fills in the templates: Awab doesn't run social media accounts or supply or edit patient photos. No app development or non-clinic websites.
Details: /services. Clinic branding: /services/clinic-branding

PORTFOLIO: ${projectList}
All projects: /projects

BEHAVIOR:
- When asked about pricing, give the USD prices above (never convert or quote other currencies) and link to /pricing.
- When asked about portfolio or examples, recommend relevant projects from the list above based on their industry.
- For clinic website inquiries, lead with SaphireDent (lead tracking and Google Ads offline conversions), then Jouvence or EsteExpert.
- For marketing/agency inquiries, recommend Omar Marketing.
- For logo, branding, Instagram or social media templates, before-and-after posts or WhatsApp profile questions, recommend the ${brandKitName} (/services/clinic-branding) and point to the Bespoke Clinics (/projects/bespoke-clinic) and Yasmina Beauty (/projects/yasmina-beauty) case studies. If the clinic also needs a website, mention the ${bundleName} bundle. Quote links: /contact?plan=${brandKit.contactValue} or /contact?plan=${brandKit.bundle.contactValue}.
- Websites are the main offer: on website questions, lead with the two packages, not the ${brandKitName}.
- To collect leads: ask name → email → phone (optional). Confirm 24hr response.
- Always suggest /contact for a personalized quote.${contextInfo ? `\nVisitor info:${contextInfo}` : ""}`;
}

/**
 * Smart context management - keeps important messages while staying within limits
 */
function getOptimizedHistory(history: ChatMessage[]): ChatMessage[] {
  if (history.length <= PRIORITY_MESSAGE_COUNT) {
    return history;
  }

  // Always keep the last N priority messages
  const priorityMessages = history.slice(-PRIORITY_MESSAGE_COUNT);

  // Get remaining messages
  const olderMessages = history.slice(0, -PRIORITY_MESSAGE_COUNT);

  // Calculate character budget
  const priorityChars = priorityMessages.reduce((sum, m) => sum + m.content.length, 0);
  const remainingBudget = MAX_TOTAL_CHARS - priorityChars;

  // Select older messages that fit within budget, prioritizing newer ones
  const selectedOlderMessages: ChatMessage[] = [];
  let currentChars = 0;

  // Process from newest to oldest
  for (let i = olderMessages.length - 1; i >= 0; i--) {
    const msg = olderMessages[i];
    const msgChars = msg.content.length;

    if (currentChars + msgChars <= remainingBudget) {
      selectedOlderMessages.unshift(msg);
      currentChars += msgChars;
    }

    // Stop if we've collected enough messages
    if (selectedOlderMessages.length >= MAX_CONTEXT_MESSAGES - PRIORITY_MESSAGE_COUNT) {
      break;
    }
  }

  // If we have contact info messages, prioritize keeping them
  const contactMessages = olderMessages.filter(
    (m) =>
      m.content.toLowerCase().includes("email") ||
      m.content.toLowerCase().includes("phone") ||
      m.content.toLowerCase().includes("name") ||
      m.content.toLowerCase().includes("@")
  );

  // Add important contact messages if not already included
  for (const contactMsg of contactMessages) {
    if (!selectedOlderMessages.includes(contactMsg) && !priorityMessages.includes(contactMsg)) {
      const msgChars = contactMsg.content.length;
      if (currentChars + msgChars <= remainingBudget) {
        selectedOlderMessages.push(contactMsg);
        currentChars += msgChars;
      }
    }
  }

  // Sort by original order
  selectedOlderMessages.sort((a, b) => {
    return olderMessages.indexOf(a) - olderMessages.indexOf(b);
  });

  return [...selectedOlderMessages, ...priorityMessages];
}

/**
 * Calls OpenRouter API to get AI response
 */
export async function getOpenRouterResponse(
  userMessage: string,
  context: ChatContext,
  locale?: string
): Promise<string> {
  const apiKey = process.env.OPENROUTER_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_KEY not configured");
  }

  // Build conversation history for the API
  const messages: Array<{ role: string; content: string }> = [
    {
      role: "system",
      content: buildSystemPrompt(context, locale),
    },
  ];

  // Get optimized conversation history
  const optimizedHistory = getOptimizedHistory(context.conversationHistory);

  for (const msg of optimizedHistory) {
    // Skip system messages from history (we have our own system prompt)
    if (msg.role !== "system") {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }
  }

  // Add current user message
  messages.push({
    role: "user",
    content: userMessage,
  });

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://www.awab.design",
        "X-Title": "Awab Portfolio Chat",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // Using a cost-effective model
        messages,
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data: OpenRouterResponse = await response.json();

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    }

    throw new Error("No response from OpenRouter");
  } catch (error) {
    console.error("Error calling OpenRouter:", error);
    throw error;
  }
}
