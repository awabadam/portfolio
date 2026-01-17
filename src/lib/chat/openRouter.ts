import { ChatMessage, ChatContext } from "./chatBot";
import { services, pricingInfo, businessInfo, faqs } from "./knowledgeBase";

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

/**
 * Builds a system prompt with knowledge base information
 */
function buildSystemPrompt(context: ChatContext): string {
  const servicesList = services
    .map((s, i) => `${i + 1}. ${s.name}: ${s.description}`)
    .join("\n");

  const faqsList = faqs
    .map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`)
    .join("\n\n");

  let contextInfo = "";
  if (context.visitorName) {
    contextInfo += `\nVisitor's name: ${context.visitorName}`;
  }
  if (context.visitorEmail) {
    contextInfo += `\nVisitor's email: ${context.visitorEmail}`;
  }
  if (context.visitorPhone) {
    contextInfo += `\nVisitor's phone: ${context.visitorPhone}`;
  }

  return `You are a helpful AI assistant for Awab Elkhalil, a web designer and developer based in Istanbul, Turkey. Your role is to help visitors learn about Awab's services and answer their questions in a friendly, professional manner.

ABOUT AWAB:
- Name: ${businessInfo.name}
- Location: ${businessInfo.location}
- Experience: ${businessInfo.experience}
- Projects completed: ${businessInfo.projects}
- Response time: ${businessInfo.responseTime}
- Email: ${businessInfo.email}
- Portfolio: ${businessInfo.portfolio}
- Rate Calculator: ${businessInfo.rateCalculator}

SERVICES OFFERED:
${servicesList}

PRICING INFORMATION:
- Landing Page: Starting at $${pricingInfo.landing.base}
- Business Website: Starting at $${pricingInfo.business.base}
- Custom Website: Starting at $${pricingInfo.custom.base}
- Rate Calculator: ${pricingInfo.calculator}

FREQUENTLY ASKED QUESTIONS:
${faqsList}

CONTACT COLLECTION:
If a visitor wants to get in touch or request a quote, you should collect their information:
1. Ask for their name
2. Ask for their email address
3. Optionally ask for their phone number

When collecting contact information, be conversational and friendly. After collecting the information, confirm that Awab will contact them within 24 hours.

${contextInfo ? `\nCURRENT VISITOR CONTEXT:${contextInfo}` : ""}

GUIDELINES:
- Be friendly, professional, and helpful
- Keep responses concise but informative
- If you don't know something, direct them to contact Awab directly
- Use the knowledge base information provided above to answer questions accurately
- If asked about contact, start collecting their information (name, email, phone)
- Always maintain a positive, helpful tone
- Don't make up information that's not in the knowledge base
- If asked about portfolio or work, mention they can view it at ${businessInfo.portfolio}`;
}

/**
 * Calls OpenRouter API to get AI response
 */
export async function getOpenRouterResponse(
  userMessage: string,
  context: ChatContext
): Promise<string> {
  const apiKey = process.env.OPENROUTER_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_KEY not configured");
  }

  // Build conversation history for the API
  const messages: Array<{ role: string; content: string }> = [
    {
      role: "system",
      content: buildSystemPrompt(context),
    },
  ];

  // Add conversation history (last 8 messages to avoid token limits, leaving room for system prompt and current message)
  const recentHistory = context.conversationHistory.slice(-8);
  for (const msg of recentHistory) {
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
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://awab.design",
        "X-Title": "Awab Portfolio Chat",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // Using a cost-effective model
        messages,
        temperature: 0.7,
        max_tokens: 500,
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
