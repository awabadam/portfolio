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
    name: "Web Design & Development",
    description:
      "Modern, responsive websites built with Next.js, React, and Tailwind CSS. Mobile-first, SEO-optimized, conversion-focused.",
    pricing: "Landing pages from $900, business websites from $2,200, custom builds from $4,500, app development from $8,000 (international rates; lower local/regional pricing available). Each package bundles premium add-ons free (SEO on every tier; plus blog, CMS, multi-language, and AI chatbot depending on tier).",
    link: "/services",
  },
  {
    name: "UI/UX Design",
    description:
      "User-centered interfaces that feel intuitive. Research, wireframes, prototypes, and design systems.",
    link: "/services",
  },
  {
    name: "SEO Setup",
    description:
      "Optimized site structure, meta tags, fast loading, and sitemaps to rank higher on search engines.",
    pricing: "Included free with every package ($600 value)",
    link: "/rate-calculator",
  },
  {
    name: "AI Chatbot Integration",
    description:
      "24/7 automated support for visitors. AI-powered conversation flows, lead qualification, and CRM integration.",
    pricing: "Included free with App Development; otherwise from $500 as an add-on",
    link: "/rate-calculator",
  },
  {
    name: "Brand Identity",
    description:
      "Logos, color palettes, typography, guidelines, business cards, and social media templates.",
    pricing: "Starting from $800",
    link: "/services/brand-identity",
  },
  {
    name: "Domain & Hosting Management",
    description:
      "Managed domain registration & renewal, SSL, and reliable hosting — handled for you as part of a monthly Care Plan. You own your domain and can request a full transfer anytime (handover within 3 business days, no lock-in).",
    pricing: "Included in Care Plans from $29/month",
    link: "/services/website-maintenance",
  },
  {
    name: "Care Plans (Hosting, Domain & Maintenance)",
    description:
      "One managed monthly plan per site tier: hosting + domain + SSL + security/monitoring + a change allowance that scales with the site. Care Lite (landing), Care Standard (business), Care Pro (custom/apps).",
    pricing: "From $29/month (Lite $29 · Standard $79 · Pro $149)",
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
    results: ["ROI-driven with conversion tracking", "Bilingual (EN/AR)", "95+ Lighthouse score"],
    link: "/projects/omar-marketing",
  },
  {
    name: "SaphireDent",
    category: "Healthcare / Dental",
    description: "Modern dental clinic website with a clean, professional aesthetic.",
    results: ["40% increase in patient inquiries", "Optimized for Istanbul dental search terms"],
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
  experience: "5+ years",
  projectCount: "50+ projects completed",
  responseTime: "24 hours",
  email: "awabe.adam@gmail.com",
  phone: "+90 554 175 9945",
  whatsapp: "+90 554 175 9945",
  languages: "English, Arabic, Turkish, French",
  portfolio: "/projects",
  services: "/services",
  contact: "/contact",
  rateCalculator: "/rate-calculator",
};

export const faqs: FAQ[] = [
  {
    question: "What services do you offer?",
    answer:
      "I offer web design & development, UI/UX design, SEO, AI chatbot integration, brand identity, domain & hosting management, and website maintenance. Check /services for details or /rate-calculator for an instant quote.",
    keywords: ["services", "what do you do", "offer", "provide", "help"],
  },
  {
    question: "How much does a website cost?",
    answer:
      "Pricing depends on the type of website and add-ons you need. Use /rate-calculator for an instant, personalized estimate — it shows prices based on your region automatically.",
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
      "5+ years of experience, 50+ projects completed. I've worked with clinics, marketing agencies, restaurants, and startups. Check out my portfolio at /projects.",
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
      "Yes! Visit /projects to see my work. Featured projects include Jouvence (aesthetics clinic), EsteExpert (medical aesthetics), Omar Marketing (agency), and SaphireDent (dental clinic, 40% more inquiries).",
    keywords: ["portfolio", "work", "projects", "examples", "showcase", "case study"],
  },
  {
    question: "How long does a project take?",
    answer:
      "Landing pages take about 1 week, business websites 2-4 weeks, custom projects 4-8 weeks depending on complexity.",
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
      "Every website includes basic SEO — optimized structure, meta tags, fast loading, sitemap. Advanced SEO optimization is also available as an add-on. Check /rate-calculator for pricing.",
    keywords: ["seo", "search engine", "google", "ranking", "search"],
  },
  {
    question: "Can you add a chatbot to my site?",
    answer:
      "Yes! AI chatbot integration is available as an add-on for any website. It provides 24/7 automated support, lead qualification, and CRM integration. See /rate-calculator for pricing.",
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
      "Yes! Multi-language support is available as an add-on. I can build your site in English, Turkish, Arabic, French, or any language your audience needs. See /rate-calculator for pricing.",
    keywords: ["language", "multilingual", "translation", "bilingual", "multi-language"],
  },
  {
    question: "What happens after launch?",
    answer:
      "I offer ongoing maintenance plans covering security updates, performance optimization, and content changes. You're never left on your own. Check /services/website-maintenance for plan details.",
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
  "Thanks for stopping by! Get your instant quote at /rate-calculator anytime.",
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
