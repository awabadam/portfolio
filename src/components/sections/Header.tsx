"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Check } from "lucide-react";

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
          formType: "header", // Identify this as a header form submission
          name: "Website Audit Request", // Default name for header form
          projectType: "audit", // Default project type for header form
          message:
            "This user has requested a free website audit & consultation.",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setIsSubmitted(true);
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 5000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "object" && err !== null && "error" in err) {
        // Handle API error response
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
              Elevate Your Digital Presence
            </h2>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Stunning Web Design That Converts
            </h1>
          </div>

          <p className="text-xl leading-relaxed text-muted-foreground">
            I help businesses stand out online with modern, responsive websites
            that attract clients and drive results.
          </p>

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
              alt="Awab Elkhalil"
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
