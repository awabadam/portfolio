import { ChatMessage, ChatContext } from "./chatBot";
import { services, projects, businessInfo, faqs } from "./knowledgeBase";
// 💰 Pricing source of truth: edit prices in src/lib/pricing.ts
// The chat assistant's pricing answers are generated from this data.
import { projectTiers, addOns, getPrice, formatPrice, FALLBACK_TRY_RATE } from "@/lib/pricing";

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
  const tryRate = FALLBACK_TRY_RATE;

  // Build locale-aware pricing
  const tierPrices = projectTiers.map((t) => {
    const price = getPrice(t.id, t.basePrice, loc);
    return `${t.nameKey === "landingPage" ? "Landing Page" : t.nameKey === "businessWebsite" ? "Business Website" : "Custom Website"}: from ${formatPrice(price, loc, tryRate)}`;
  }).join(", ");

  const addOnLabels: Record<string, string> = {
    seo: "SEO Setup",
    blog: "Blog",
    cms: "CMS",
    chatbot: "AI Chatbot",
    multilang: "Multi-language",
  };
  const addOnPrices = addOns.map((a) => {
    const price = getPrice(a.id, a.price, loc);
    return `${addOnLabels[a.id] ?? a.id} (+${formatPrice(price, loc, tryRate)})`;
  }).join(", ");

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
About: Web designer/developer in Istanbul. 5+ years, 50+ projects. Speaks English, Arabic, Turkish, French.
Email: ${businessInfo.email} | WhatsApp: ${businessInfo.phone}

PRICING (${loc.toUpperCase()} locale):
${tierPrices}
Add-ons: ${addOnPrices}
Instant quote: /rate-calculator

SERVICES: Web Design, UI/UX, SEO, Blog, CMS, AI Chatbot, Multi-language, Brand Identity, Domain & Hosting, Maintenance (from $150/mo).
Details: /services

PORTFOLIO: ${projectList}
All projects: /projects

BEHAVIOR:
- When asked about pricing, give locale-specific prices above and link to /rate-calculator.
- When asked about portfolio or examples, recommend relevant projects from the list above based on their industry.
- For healthcare/clinic inquiries, recommend Jouvence, EsteExpert, or SaphireDent.
- For marketing/agency inquiries, recommend Omar Marketing.
- To collect leads: ask name → email → phone (optional). Confirm 24hr response.
- Always suggest /rate-calculator for detailed quotes.${contextInfo ? `\nVisitor info:${contextInfo}` : ""}`;
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
