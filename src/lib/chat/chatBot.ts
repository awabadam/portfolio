import {
  services,
  businessInfo,
  faqs,
  greetings,
  farewells,
  findMatchingFAQ,
} from "./knowledgeBase";
// 💰 Pricing source of truth: edit prices in src/lib/pricing.ts
import { getPrice } from "@/lib/pricing";

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
  return farewells.some((f) => lowerMessage.includes(f));
}

export function processMessage(
  userMessage: string,
  context: ChatContext
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
    response = `I offer ${services.length} main services:\n\n${serviceList}\n\nWould you like to know more about any specific service or get a detailed quote?`;
    return { response, context: newContext };
  }

  if (
    lowerMessage.includes("price") ||
    lowerMessage.includes("cost") ||
    lowerMessage.includes("how much")
  ) {
    const landing = getPrice("landing", 300, "en");
    const business = getPrice("business", 700, "en");
    const custom = getPrice("custom", 1800, "en");
    response = `Here's our pricing structure:\n\n• Landing Page: Starting at $${landing.toLocaleString()}\n• Business Website: Starting at $${business.toLocaleString()}\n• Custom Website: Starting at $${custom.toLocaleString()}\n\nSee /pricing for full package details, or reach out at /contact for a personalized quote based on your specific needs.`;
    return { response, context: newContext, action: "show_pricing" };
  }

  if (
    lowerMessage.includes("portfolio") ||
    lowerMessage.includes("work") ||
    lowerMessage.includes("projects") ||
    lowerMessage.includes("examples")
  ) {
    response = `Absolutely! You can view my portfolio at ${businessInfo.portfolio}. I've worked on various projects including web design, graphic design, and UI/UX projects. Would you like me to help you with anything specific?`;
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
    response = `I have ${businessInfo.experience} of experience and have completed ${businessInfo.projectCount}. I specialize in modern, conversion-focused websites that help businesses stand out online.`;
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

