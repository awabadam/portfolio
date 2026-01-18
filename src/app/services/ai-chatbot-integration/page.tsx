import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Clock, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Chatbot Integration Services | Awab Elkhalil",
  description:
    "Integrate intelligent AI chatbots to automate customer support, qualify leads, and provide 24/7 assistance on your website. Starting from $600. 1-2 weeks delivery.",
  keywords: [
    "AI chatbot integration",
    "chatbot development",
    "customer support chatbot",
    "lead generation chatbot",
    "AI assistant",
    "automated chat support",
    "website chatbot",
    "conversational AI",
  ],
  openGraph: {
    title: "AI Chatbot Integration Services",
    description:
      "Integrate intelligent AI chatbots to automate customer support, qualify leads, and provide 24/7 assistance on your website.",
    url: "https://awab.design/services/ai-chatbot-integration",
  },
  alternates: {
    canonical: "/services/ai-chatbot-integration",
  },
};

const AIChatbotIntegrationPage = () => {
  return (
    <main className="min-h-screen bg-background pt-32">
      <div className="container mx-auto px-4 py-16">
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>

        <div className="mb-16">
          <h1 className="mb-6 font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            AI Chatbot
            <br />
            Integration
          </h1>
          <p className="lead mb-8 max-w-3xl text-2xl leading-relaxed text-muted-foreground md:text-3xl">
            Integrate intelligent AI chatbots to automate customer support,
            qualify leads, and provide 24/7 assistance on your website.
          </p>

          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="text-xl font-semibold text-primary">
                Starting from $600
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg text-muted-foreground">1-2 weeks</span>
            </div>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="mb-8 font-display text-3xl font-bold">
            What's Included
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              "AI-powered conversation flows",
              "Lead qualification & capture",
              "24/7 automated support",
              "Multi-language support",
              "Analytics & insights",
              "Custom chatbot design",
              "Integration with your CRM",
              "Knowledge base setup",
              "Training & documentation",
              "Ongoing optimization",
            ].map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 font-display text-3xl font-bold">
            Our Process
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { step: "01", title: "Planning", desc: "Understanding your support needs and use cases" },
              { step: "02", title: "Design", desc: "Creating conversation flows and chatbot personality" },
              { step: "03", title: "Develop", desc: "Building and training the AI chatbot system" },
              { step: "04", title: "Deploy", desc: "Integration, testing, and going live" },
            ].map((phase) => (
              <div key={phase.step} className="border-t border-border pt-6">
                <span className="mb-2 block font-mono text-sm text-muted-foreground">
                  {phase.step}
                </span>
                <h3 className="mb-2 font-display text-xl font-bold">{phase.title}</h3>
                <p className="text-sm text-muted-foreground">{phase.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-muted/30 p-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold">
            Ready to Automate Your Support?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Get an instant quote or schedule a free consultation to discuss your AI chatbot integration needs.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-14 px-8 text-lg">
              <Link href="/rate-calculator">Get Instant Quote</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg">
              <Link href="/contact">Contact Me</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AIChatbotIntegrationPage;
