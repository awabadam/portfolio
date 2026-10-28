import {
  services,
  businessInfo,
  faqs,
  greetings,
  farewells,
  findMatchingFAQ,
} from "./knowledgeBase";
// 💰 Pricing source of truth: edit prices in src/lib/pricing.ts
import { getTier, getCarePlan, brandKit, getBrandKitBundlePrice, formatPrice, formatPlanPrice } from "@/lib/pricing";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  metadata?: Record<string, any>;
}

export interface ChatContext {
  conversationHistory: ChatMessage[];
  visitorName?: string;
  visitorEmail?: string;
  visitorPhone?: string;
  isCollectingInfo?: {
    type: "name" | "email" | "phone" | "contact";
  };
}

export function generateSessionId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function isGreeting(message: string): boolean {
  const greetings = [
    "hi",
    "hello",
    "hey",
    "good morning",
    "good afternoon",
    "good evening",
    "greetings",
  ];
  return greetings.some((g) => message.toLowerCase().startsWith(g));
}

export function isFarewell(message: string): boolean {
  const farewells = [
    "bye",
    "goodbye",
    "see you",
    "thanks",
    "thank you",
    "thank",
    "later",
    "cya",
  ];
  const lowerMessage = message.toLowerCase();
  // Whole words only: "see you" must not match "can I see your work?".
  return farewells.some((f) => new RegExp(`\\b${f}\\b`).test(lowerMessage));
}

export function processMessage(
  userMessage: string,
  context: ChatContext,
  locale: string = "en"
): { response: string; context: ChatContext; action?: string } {
  const lowerMessage = userMessage.toLowerCase().trim();
  let response = "";
  let action: string | undefined;
  const newContext = { ...context };

  // Handle greetings
  if (isGreeting(lowerMessage)) {
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    return { response: greeting, context: newContext };
  }

  // Handle farewells
  if (isFarewell(lowerMessage)) {
    const farewell = farewells[Math.floor(Math.random() * farewells.length)];
    return { response: farewell, context: newContext };
  }

  // Handle contact information collection
  if (newContext.isCollectingInfo) {
    if (newContext.isCollectingInfo.type === "name") {
      newContext.visitorName = userMessage;
      newContext.isCollectingInfo = { type: "email" };
      return {
        response:
          `Nice to meet you, ${userMessage}! What's your email address?`,
        context: newContext,
      };
    }
    if (newContext.isCollectingInfo.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(userMessage)) {
        newContext.visitorEmail = userMessage;
        newContext.isCollectingInfo = { type: "phone" };
        return {
          response:
            "Great! And what's your phone number? (You can skip this if you prefer)",
          context: newContext,
        };
      } else {
        return {
          response:
            "That doesn't look like a valid email address. Could you please provide a valid email?",
          context: newContext,
        };
      }
    }
    if (newContext.isCollectingInfo.type === "phone") {
      if (lowerMessage === "skip" || lowerMessage === "no" || lowerMessage === "") {
        newContext.isCollectingInfo = undefined;
        return {
          response:
            "Perfect! I'll make sure Awab gets in touch with you soon. Is there anything else I can help you with?",
          context: newContext,
          action: "contact_collected",
        };
      } else {
        newContext.visitorPhone = userMessage;
        newContext.isCollectingInfo = undefined;
        return {
          response:
            "Excellent! I've collected your information. Awab will contact you within 24 hours. Is there anything else I can help you with?",
          context: newContext,
          action: "contact_collected",
        };
      }
    }
  }

  // Handle specific queries
  if (lowerMessage.includes("service") || lowerMessage.includes("what do you")) {
    const serviceList = services
      .map((s, i) => `${i + 1}. ${s.name}: ${s.description}${s.pricing ? ` (${s.pricing})` : ""}`)
      .join("\n\n");
    response = `Here's what I offer clinics:\n\n${serviceList}\n\nWould you like to know more about any specific service or get a detailed quote?`;
    return { response, context: newContext };
  }

  if (
    lowerMessage.includes("price") ||
    lowerMessage.includes("cost") ||
    lowerMessage.includes("how much")
  ) {
    const price = (item: { price: number }) => formatPrice(item.price);
    response = `Here's how pricing works:\n\n• Clinic Website: from ${price(getTier("business"))}\n• Clinic Growth System: from ${price(getTier("custom"))}\n• Site Care: ${price(getCarePlan("careStandard"))}/month\n• Growth Retainer: ${formatPlanPrice(getCarePlan("carePro"))}/month\n• Clinic Brand Kit (logo, social templates, WhatsApp kit): from ${price(brandKit)}, or ${formatPrice(getBrandKitBundlePrice())} together with the Clinic Growth System\n\nSee /pricing for what each one includes, or reach out at /contact for a quote for your clinic.`;
    return { response, context: newContext, action: "show_pricing" };
  }

  if (
    lowerMessage.includes("portfolio") ||
    lowerMessage.includes("work") ||
    lowerMessage.includes("projects") ||
    lowerMessage.includes("examples")
  ) {
    response = `Absolutely! You can view my portfolio at ${businessInfo.portfolio}. Recent work is mostly clinic websites, including SaphireDent (dental), Jouvence and EsteExpert (aesthetics), plus clinic branding for Bespoke Clinics and Yasmina Beauty. Would you like me to help you with anything specific?`;
    return { response, context: newContext, action: "show_portfolio" };
  }

  if (
    lowerMessage.includes("contact") ||
    lowerMessage.includes("get in touch") ||
    lowerMessage.includes("reach") ||
    lowerMessage.includes("email")
  ) {
    newContext.isCollectingInfo = { type: "name" };
    response =
      "Great! I'd be happy to help you get in touch. To make sure Awab can reach you, could you please tell me your name?";
    return { response, context: newContext, action: "start_contact" };
  }

  if (
    lowerMessage.includes("location") ||
    lowerMessage.includes("where") ||
    lowerMessage.includes("based")
  ) {
    response = `I'm based in ${businessInfo.location}, but I work with clients worldwide remotely. I'm fluent in English and Arabic.`;
    return { response, context: newContext };
  }

  if (
    lowerMessage.includes("experience") ||
    lowerMessage.includes("years") ||
    lowerMessage.includes("how long")
  ) {
    response = `I build websites for Istanbul clinics that treat patients from abroad: SaphireDent (dental), Jouvence (aesthetics) and EsteExpert (medical aesthetics). Each one is multilingual and tracks where inquiries come from. I also design clinic brands: logo, social templates and a WhatsApp kit, as for Bespoke Clinics and Yasmina Beauty. See /projects for the case studies.`;
    return { response, context: newContext };
  }

  if (
    lowerMessage.includes("quote") ||
    lowerMessage.includes("estimate") ||
    lowerMessage.includes("calculator")
  ) {
    response = `You can get a personalized quote by reaching out at ${businessInfo.contact}. Just share your project details and I'll estimate the cost based on your specific requirements. Would you like me to help you get in touch?`;
    return { response, context: newContext, action: "start_contact" };
  }

  // Try to find matching FAQ
  const matchingFAQ = findMatchingFAQ(lowerMessage);
  if (matchingFAQ) {
    return { response: matchingFAQ.answer, context: newContext };
  }

  // Default response for unrecognized queries
  response =
    "I understand you're asking about something. Could you be more specific? I can help you with:\n\n• Information about services\n• Pricing and quotes\n• Viewing the portfolio\n• Getting in touch\n• Answering FAQs\n\nWhat would you like to know?";
  return { response, context: newContext };
}

