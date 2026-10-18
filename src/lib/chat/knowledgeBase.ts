// 💰 Pricing source of truth: edit prices in src/lib/pricing.ts
import { getTier, getCarePlan, formatPrice } from "@/lib/pricing";

export interface Service {
  name: string;
  description: string;
  pricing?: string;
  link?: string;
}

export interface ProjectInfo {
  name: string;
  category: string;
  description: string;
  results?: string[];
  link: string;
}

export interface FAQ {
  question: string;
  answer: string;
  keywords: string[];
}

export const services: Service[] = [
  {
    name: "Clinic Website",
    description:
      "Multilingual site for clinics that treat international patients: up to 3 languages, a page for each treatment, a WhatsApp button on every treatment page, and tracking for WhatsApp clicks, forms and calls. SEO setup with medical schema included.",
    pricing: `From ${formatPrice(getTier("business").price)}`,
    link: "/pricing",
  },
  {
    name: "Clinic Growth System",
    description:
      "Everything in Clinic Website, plus 6+ languages including Arabic (right-to-left), an admin panel for the clinic team, an AI patient assistant, every inquiry saved with the patient's country, CRM handoff, and Google Ads offline-conversion export so the clinic can see which ads bring patients.",
    pricing: `From ${formatPrice(getTier("custom").price)}`,
    link: "/pricing",
  },
  {
    name: "Site Care",
    description:
      "Monthly plan: hosting, domain, SSL, security updates and small content changes. You own your domain and can transfer it anytime (handover within 3 business days, no lock-in).",
    pricing: `${formatPrice(getCarePlan("careStandard").price)}/month`,
    link: "/services/website-maintenance",
  },
  {
    name: "Growth Retainer",
    description:
      "Site Care plus a monthly lead report (inquiries by country and source), upkeep of Google Ads conversion tracking, landing pages for new treatments or campaigns, and priority changes.",
    pricing: `${formatPrice(getCarePlan("carePro").price)}/month`,
    link: "/services/website-maintenance",
  },
];

export const projects: ProjectInfo[] = [
  {
    name: "Jouvence",
    category: "Healthcare / Aesthetics",
    description: "Luxury aesthetics clinic website with multilingual support (EN, TR, AR).",
    results: ["Multilingual site serving 3 markets", "Luxury brand positioning", "Mobile-first patient experience"],
    link: "/projects/jouvence",
  },
  {
    name: "EsteExpert Clinic",
    category: "Healthcare / Medical Aesthetics",
    description: "Medical aesthetics clinic website designed for trust and conversions.",
    results: ["SEO-optimized for medical keywords", "Trust-building with doctor profiles", "Booking-focused design"],
    link: "/projects/esteexpert",
  },
  {
    name: "Omar Marketing",
    category: "Marketing Agency",
    description: "ROI-driven marketing agency website with bold dark theme and scroll animations.",
    results: ["Conversion tracking built in", "Bilingual (EN/AR)", "Fast-loading dark theme"],
    link: "/projects/omar-marketing",
  },
  {
    name: "SaphireDent",
    category: "Healthcare / Dental",
    description: "Nine-language dental clinic site that captures every inquiry and sends it to the clinic's CRM and Google Ads.",
    results: ["Nine languages with right-to-left Arabic", "Every inquiry recorded with country and source, sent to the CRM and Google Ads"],
    link: "/projects/saphiredent",
  },
  {
    name: "Awab.Design",
    category: "Portfolio",
    description: "Personal portfolio showcasing creative work and web design projects.",
    link: "/projects/awab-design",
  },
];

export const businessInfo = {
  name: "Awab Design",
  owner: "Awab Elkhalil",
  location: "Istanbul, Turkey",
  responseTime: "24 hours",
  email: "awabe.adam@gmail.com",
  phone: "+90 554 175 9945",
  whatsapp: "+90 554 175 9945",
  languages: "English, Arabic, Turkish, French",
  portfolio: "/projects",
  services: "/services",
  contact: "/contact",
  pricing: "/pricing",
};

export const faqs: FAQ[] = [
  {
    question: "What services do you offer?",
    answer:
      "I build websites for Istanbul clinics that treat international patients — dental, aesthetic, hair and medical tourism. Two packages: Clinic Website and Clinic Growth System, plus monthly Site Care or a Growth Retainer. See /services or /pricing.",
    keywords: ["services", "what do you do", "offer", "provide", "help"],
  },
  {
    question: "How much does a website cost?",
    answer:
      "There are two fixed-price packages: Clinic Website and Clinic Growth System. Prices are in USD on /pricing, the same in every country. Or reach out at /contact for a quote for your clinic.",
    keywords: ["price", "cost", "pricing", "how much", "fee", "budget", "rate", "quote"],
  },
  {
    question: "Where are you located?",
    answer:
      "Based in Istanbul, Turkey, but I work with clients worldwide. I speak English, Arabic, Turkish, and French.",
    keywords: ["location", "where", "based", "istanbul", "turkey", "country"],
  },
  {
    question: "What's your experience?",
    answer:
      "I work mostly with clinics that treat international patients: SaphireDent (dental), Jouvence (aesthetics) and EsteExpert (medical aesthetics). See /projects.",
    keywords: ["experience", "years", "projects", "portfolio", "background", "work"],
  },
  {
    question: "How can I contact you?",
    answer:
      "Email me at awabe.adam@gmail.com, call/WhatsApp +90 554 175 9945, or use the contact form at /contact. I respond within 24 hours.",
    keywords: ["contact", "get in touch", "reach", "email", "phone", "whatsapp", "call"],
  },
  {
    question: "Can I see your portfolio?",
    answer:
      "Yes! Visit /projects to see my work. Featured projects include Jouvence (aesthetics clinic), EsteExpert (medical aesthetics), Omar Marketing (agency), and SaphireDent (dental clinic, nine languages).",
    keywords: ["portfolio", "work", "projects", "examples", "showcase", "case study"],
  },
  {
    question: "How long does a project take?",
    answer:
      "A Clinic Website takes 3-4 weeks. A Clinic Growth System takes 6-8 weeks, depending on how many treatments and languages you need.",
    keywords: ["timeline", "how long", "duration", "time", "deadline", "delivery"],
  },
  {
    question: "Do you handle domain and hosting?",
    answer:
      "Yes! I register domain names, set up SSL certificates, and manage hosting on reliable providers. You don't have to worry about the technical side.",
    keywords: ["domain", "hosting", "ssl", "server", "register"],
  },
  {
    question: "Do you offer SEO?",
    answer:
      "Yes. Both packages include SEO setup with medical schema, so Google understands your treatments, doctors and location. Check /pricing for details.",
    keywords: ["seo", "search engine", "google", "ranking", "search"],
  },
  {
    question: "Can you add a chatbot to my site?",
    answer:
      "Yes. An AI patient assistant is included in the Clinic Growth System. It answers patient questions in their language at any hour and passes the inquiry to your team. See /pricing for details.",
    keywords: ["chatbot", "bot", "ai", "automation", "support", "chat"],
  },
  {
    question: "Do you work with international clients?",
    answer:
      "Absolutely! I'm based in Istanbul but work with clients worldwide. I'm fluent in English, Arabic, Turkish, and French.",
    keywords: ["international", "remote", "worldwide", "global", "clients", "abroad"],
  },
  {
    question: "Can my website be in multiple languages?",
    answer:
      "Yes. The Clinic Website covers up to 3 languages and the Clinic Growth System 6 or more, including Arabic (right-to-left). See /pricing for details.",
    keywords: ["language", "multilingual", "translation", "bilingual", "multi-language"],
  },
  {
    question: "What happens after launch?",
    answer:
      "Two monthly plans: Site Care (hosting, domain, SSL, security and small changes) and the Growth Retainer, which adds a monthly lead report and keeps your Google Ads conversion tracking working. See /services/website-maintenance.",
    keywords: ["after", "launch", "maintenance", "support", "updates", "ongoing"],
  },
];

export const greetings = [
  "Hello! I'm here to help you with web design services. What are you looking for?",
  "Hi there! Need a website, quote, or want to see our work? I can help!",
  "Hey! I can tell you about pricing, show portfolio examples, or help you get a quote. What would you like?",
];

export const farewells = [
  "Thanks for visiting! Feel free to reach out anytime. Have a great day!",
  "Great chatting! If you need anything else, just ask. Take care!",
  "Thanks for stopping by! Reach out anytime at /contact for a quote.",
];

export function findMatchingFAQ(query: string): FAQ | null {
  const lowerQuery = query.toLowerCase();
  for (const faq of faqs) {
    if (
      faq.keywords.some((keyword) => lowerQuery.includes(keyword)) ||
      lowerQuery.includes(faq.question.toLowerCase())
    ) {
      return faq;
    }
  }
  return null;
}

export function findRelevantProjects(query: string): ProjectInfo[] {
  const lowerQuery = query.toLowerCase();
  return projects.filter(
    (p) =>
      lowerQuery.includes(p.category.toLowerCase()) ||
      lowerQuery.includes(p.name.toLowerCase()) ||
      p.description.toLowerCase().split(" ").some((word) => lowerQuery.includes(word) && word.length > 4)
  );
}
