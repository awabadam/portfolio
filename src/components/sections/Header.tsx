"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Check, Star, Users, Zap } from "lucide-react";
import { trackFormSubmission, trackLeadGeneration } from "@/lib/gtm";

const Header = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          formType: "header",
          name: "Website Audit Request",
          projectType: "audit",
          message:
            "This user has requested a free website audit & consultation.",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setIsSubmitted(true);

      // Track form submission
      trackFormSubmission("header_audit_form", "website_audit");
      trackLeadGeneration("hero_section", "website_audit");

      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 5000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "object" && err !== null && "error" in err) {
        setError((err as any).error || "Failed to send message");
      } else {
        setError("Something went wrong. Please try again later.");
      }
      console.error("Error submitting form:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
      <div className="grid h-full w-full gap-8 md:grid-cols-2 md:gap-12">
        {/* Left Column - Content */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
              Istanbul-Based Web Designer & Developer
            </h2>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Websites That Drive{" "}
              <span className="text-primary">Real Results</span>
            </h1>
          </div>

          <p className="text-xl leading-relaxed text-muted-foreground">
            I help healthcare businesses and startups in Istanbul create
            websites that
            <strong> convert visitors into patients and customers</strong>.
            Specializing in modern, fast-loading sites that rank well on Google.
          </p>

          {/* Social Proof Stats */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">5+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium">50+ Projects Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="font-medium">24hr Response Time</span>
            </div>
          </div>

          {/* Lead Capture Form */}
          <Card className="border-primary/20 bg-background/50 backdrop-blur">
            <CardContent className="p-4">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Request Sent!</h3>
                  <p className="text-sm text-muted-foreground">
                    Thank you for your interest. I'll get back to you with your
                    website audit soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <h3 className="text-lg font-medium">
                    Get a free website audit & consultation
                  </h3>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      className="flex-grow"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button
                      type="submit"
                      className="whitespace-nowrap"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Get Started"}
                    </Button>
                  </div>
                  {error && (
                    <div className="text-center text-sm text-red-500">
                      {error}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    I respect your privacy. No spam, ever.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" variant="outline">
              <Link href="/projects">View My Portfolio</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="#services">Explore Services</Link>
            </Button>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/20">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0,rgba(0,0,0,0.4)_100%)]"></div>
          <div className="relative z-10 aspect-square w-full max-w-xl overflow-hidden">
            <Image
              src="/img/awab_hero.webp"
              alt="Awab Elkhalil - Web Designer & Developer in Istanbul"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-border/40 pt-8 opacity-80">
        <p className="text-sm font-medium">Trusted by innovative brands:</p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <p className="text-xl font-semibold text-muted-foreground">
            Saphiredent
          </p>
          <p className="text-xl font-semibold text-muted-foreground">
            Estetikworld
          </p>
          <p className="text-xl font-semibold text-muted-foreground">
            Sari Dental
          </p>
          <p className="text-xl font-semibold text-muted-foreground">
            Boost Sudan
          </p>
          <p className="text-xl font-semibold text-muted-foreground">
            Tenchologya
          </p>
          <p className="text-xl font-semibold text-muted-foreground">
            Italy Pizza
          </p>
          <p className="text-xl font-semibold text-muted-foreground">
            Chef's Burger
          </p>
        </div>
      </div>
    </section>
  );
};

export default Header;
