"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const Header = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the email to your CRM or email service
    console.log("Lead captured:", email);
    // Reset form
    setEmail("");
    // Show success message or redirect
    alert("Thanks for your interest! I'll be in touch soon.");
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
                  <Button type="submit" className="whitespace-nowrap">
                    Get Started
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  I respect your privacy. No spam, ever.
                </p>
              </form>
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
            Burger Chef
          </p>
        </div>
      </div>
    </section>
  );
};

export default Header;
