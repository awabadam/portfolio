export interface Service {
  name: string;
  description: string;
  pricing?: string;
  link?: string;
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
      "Custom website design using Next.js, React, and Tailwind CSS. Responsive, mobile-first design approach. Landing page optimization for conversions.",
    pricing: "Starting at $800 for landing pages, $1,200 for business websites",
    link: "/rate-calculator",
  },
  {
    name: "Graphic Design",
    description:
      "Logo design and brand identity development. Marketing materials (brochures, business cards, social media graphics). Digital advertising creatives and brand guideline development. Starting at $150 for logo design.",
  },
  {
    name: "UI/UX Design",
    description:
      "User experience research and design. Wireframing and prototyping. Interface design for web and mobile applications. Usability testing and optimization. Starting at $500.",
  },
  {
    name: "AI Chatbot Integration",
    description:
      "Intelligent chatbots for customer support and lead generation. AI-powered automation with natural language processing. Basic chatbot starting at $1,000, advanced solutions from $3,000.",
    link: "/rate-calculator",
  },
];

export const pricingInfo = {
  landing: {
    base: 800,
    description: "Landing Page - Perfect for single-page websites",
  },
  business: {
    base: 1200,
    description: "Business Website - Multi-page professional sites (3-5 pages)",
  },
  custom: {
    base: 3000,
    description: "Custom Website - Complex website with custom features and integrations",
  },
  calculator: "/rate-calculator",
};

export const businessInfo = {
  name: "Awab Elkhalil",
  location: "Istanbul, Turkey",
  experience: "5+ years",
  projects: "50+ projects completed",
  responseTime: "24 hours",
  email: "awabe.adam@gmail.com",
  portfolio: "/projects",
  contact: "/#contact",
  rateCalculator: "/rate-calculator",
};

export const faqs: FAQ[] = [
  {
    question: "What services do you offer?",
    answer:
      "I offer four main services: Web Design & Development, Graphic Design, UI/UX Design, and AI Chatbot Integration. Would you like to know more about any specific service?",
    keywords: ["services", "what do you do", "offer", "provide"],
  },
  {
    question: "How much does a website cost?",
    answer:
      "Website pricing depends on the type: Landing Page starting at $800, Business Website starting at $1,200, and Custom Website starting at $3,000. You can use our rate calculator at /rate-calculator for a detailed quote based on your specific needs.",
    keywords: ["price", "cost", "pricing", "how much", "fee"],
  },
  {
    question: "Where are you located?",
    answer: "I'm based in Istanbul, Turkey, but I work with clients worldwide remotely.",
    keywords: ["location", "where", "based", "istanbul", "turkey"],
  },
  {
    question: "What's your experience?",
    answer:
      "I have 5+ years of experience and have completed 50+ projects. I specialize in modern, conversion-focused websites.",
    keywords: ["experience", "years", "projects", "portfolio"],
  },
  {
    question: "How can I contact you?",
    answer:
      "You can contact me through the contact form on the website, or I can help you get in touch right now. What's your email address?",
    keywords: ["contact", "get in touch", "reach", "email", "phone"],
  },
  {
    question: "Can I see your portfolio?",
    answer:
      "Absolutely! You can view my portfolio at /projects. I've worked on various projects including web design, graphic design, and UI/UX projects.",
    keywords: ["portfolio", "work", "projects", "examples", "showcase"],
  },
  {
    question: "How long does a project take?",
    answer:
      "Project timelines vary based on complexity. Typically, a landing page takes 1-2 weeks, a business website takes 2-4 weeks, and custom projects take 4-8 weeks. We can discuss your specific timeline needs.",
    keywords: ["timeline", "how long", "duration", "time", "deadline"],
  },
  {
    question: "Do you work with international clients?",
    answer:
      "Yes! While I'm based in Istanbul, Turkey, I work with clients worldwide remotely. I'm fluent in English and Arabic.",
    keywords: ["international", "remote", "worldwide", "global", "clients"],
  },
];

export const greetings = [
  "Hello! I'm here to help you learn about Awab's web design services. How can I assist you today?",
  "Hi there! Welcome! I can help you with information about web design, graphic design, and UI/UX services. What would you like to know?",
  "Hey! I'm here to answer your questions about Awab's design services. How can I help you today?",
];

export const farewells = [
  "Thank you for visiting! Feel free to reach out if you have any more questions. Have a great day!",
  "It was great chatting with you! Don't hesitate to contact us if you need anything else. Goodbye!",
  "Thanks for stopping by! If you have more questions, just ask. Take care!",
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

