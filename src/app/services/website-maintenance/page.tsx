import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Clock, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "Website Maintenance Services Istanbul | Awab Elkhalil",
  description:
    "Ongoing webdesign Istanbul maintenance, updates, and optimization to keep your site secure, fast, and up-to-date. From $150/month. 24/7 support available.",
  keywords: [
    "website maintenance Istanbul",
    "webdesign Istanbul maintenance",
    "website updates Istanbul",
    "Istanbul website support",
    "website security Istanbul",
    "website optimization Istanbul",
    "content management Istanbul",
    "SEO maintenance Istanbul",
  ],
  openGraph: {
    title: "Website Maintenance Services Istanbul",
    description:
      "Ongoing webdesign Istanbul maintenance, updates, and optimization to keep your site secure, fast, and up-to-date.",
    url: "https://awab.design/services/website-maintenance",
  },
  alternates: {
    canonical: "/services/website-maintenance",
  },
};

const WebsiteMaintenancePage = () => {
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
            Webdesign Istanbul
            <br />
            Website Maintenance
          </h1>
          <p className="lead mb-8 max-w-3xl text-2xl leading-relaxed text-muted-foreground md:text-3xl">
            Ongoing webdesign Istanbul maintenance, updates, and optimization to
            keep your site secure, fast, and up-to-date.
          </p>

          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="text-xl font-semibold text-primary">
                From $150/month
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg text-muted-foreground">Ongoing</span>
            </div>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="mb-8 font-display text-3xl font-bold">
            What's Included
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              "Regular security updates",
              "Performance optimization",
              "Content updates",
              "24/7 support",
              "Local Istanbul SEO maintenance",
              "Backup & recovery",
              "Plugin & theme updates",
              "SSL certificate renewal",
              "Website monitoring",
              "Monthly performance reports",
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
            Maintenance Plans
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { name: "Basic", price: "$150/month", features: ["Security updates", "Performance checks", "Monthly backups", "Email support"] },
              { name: "Professional", price: "$300/month", features: ["All Basic features", "Content updates (up to 5 hrs)", "Priority support", "SEO optimization", "Analytics reporting"] },
              { name: "Enterprise", price: "$500/month", features: ["All Professional features", "Unlimited content updates", "24/7 support", "Custom development", "Dedicated account manager"] },
            ].map((plan) => (
              <div key={plan.name} className="rounded-2xl border border-border bg-card p-8">
                <h3 className="mb-2 font-display text-2xl font-bold">{plan.name}</h3>
                <p className="mb-6 text-2xl font-semibold text-primary">{plan.price}</p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-muted/30 p-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Contact us to discuss which maintenance plan works best for your Istanbul business.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-14 px-8 text-lg">
              <Link href="/contact">Contact Me</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default WebsiteMaintenancePage;
