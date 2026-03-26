"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Check } from "lucide-react";

// Dynamic import for Three.js component (no SSR)
const InteractiveCubes = dynamic(
  () => import("@/components/three/InteractiveCubes"),
  { ssr: false }
);

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageSrc?: string;
  hasForm?: boolean;
  formTitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  className?: string;
  imageClassName?: string;
  showTrustIndicators?: boolean;
  trustIndicators?: string[];
  useInteractiveCubes?: boolean;
  cubeCount?: number;
  isDark?: boolean;
}

const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  description,
  imageSrc = "/img/hero-image.jpg",
  hasForm = false,
  formTitle = "Get a free website audit & consultation",
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  className = "",
  imageClassName = "",
  showTrustIndicators = false,
  trustIndicators = [
    "Saphiredent",
    "Estetikworld",
    "Sari Dental",
    "Boost Sudan",
    "Tenchologya",
    "Italy Pizza",
    "Chef's Burger",
  ],
  useInteractiveCubes = false,
  cubeCount = 12,
  isDark = true,
}) => {
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
          formType: "hero",
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
      // Reset form after 5 seconds
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
    <section
      className={`container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 ${className}`}
    >
      <div className="grid h-full w-full gap-8 md:grid-cols-2 md:gap-12">
        {/* Left Column - Content */}
        <div className="flex flex-col justify-center space-y-6">
          {subtitle && (
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
              {subtitle}
            </h2>
          )}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {title}
          </h1>

          {description && (
            <p className="text-xl leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}

          {/* Lead Capture Form */}
          {hasForm && (
            <Card className="border-primary/20 bg-background/50 backdrop-blur">
              <CardContent className="p-4">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                      <Check className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium">Request Sent!</h3>
                    <p className="text-sm text-muted-foreground">
                      Thank you for your interest. I'll get back to you with
                      your website audit soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <h3 className="text-lg font-medium">{formTitle}</h3>
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
          )}

          {(ctaText || secondaryCtaText) && (
            <div className="flex flex-col gap-4 sm:flex-row">
              {ctaText && ctaLink && (
                <Button asChild size="lg" variant="outline">
                  <Link href={ctaLink}>{ctaText}</Link>
                </Button>
              )}
              {secondaryCtaText && secondaryCtaLink && (
                <Button asChild variant="ghost" size="lg">
                  <Link href={secondaryCtaLink}>{secondaryCtaText}</Link>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Image or Interactive Cubes */}
        <div
          className={`relative flex items-center justify-center overflow-hidden rounded-2xl ${
            useInteractiveCubes
              ? "bg-black"
              : "bg-gradient-to-br from-primary/5 to-primary/20"
          } ${imageClassName}`}
        >
          {useInteractiveCubes ? (
            <InteractiveCubes cubeCount={cubeCount} isDark={isDark} />
          ) : (
            <>
              <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0,rgba(0,0,0,0.4)_100%)]"></div>
              <div className="relative z-10 aspect-square w-full max-w-xl overflow-hidden">
                <Image
                  src={imageSrc}
                  alt="Hero Image"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  priority
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Trust Indicators */}
      {showTrustIndicators && (
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-border/40 pt-8 opacity-80">
          <p className="text-sm font-medium">Trusted by innovative brands:</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {trustIndicators.map((brand, index) => (
              <p
                key={index}
                className="text-xl font-semibold text-muted-foreground"
              >
                {brand}
              </p>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default PageHero;
