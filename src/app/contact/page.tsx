"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Copy, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const email = "hello@awab.design";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background pt-32">
      <div className="container mx-auto flex flex-1 flex-col px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-32"
        >
          <h1 className="font-display text-[15vw] font-bold leading-none tracking-tighter text-foreground md:text-[12vw]">
            HELLO.
          </h1>
        </motion.div>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-32">
          {/* Main Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-8"
          >
            <p className="max-w-xl text-2xl leading-relaxed text-muted-foreground md:text-3xl">
              I&apos;m currently available for freelance projects and open to new
              opportunities. Let&apos;s build something amazing together.
            </p>

            <div 
              onClick={handleCopy}
              className="group relative inline-flex cursor-pointer items-center gap-4 overflow-hidden rounded-full border border-border px-8 py-4 transition-colors hover:border-primary hover:bg-primary/5"
            >
              <Mail className="h-6 w-6 text-primary" />
              <span className="font-mono text-lg md:text-xl">{email}</span>
              <div className="relative h-6 w-6">
                <AnimateCopy copied={copied} />
              </div>
            </div>
          </motion.div>

          {/* Socials & Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col justify-end gap-12"
          >
            <div className="grid grid-cols-2 gap-8 md:gap-16">
              <div>
                <h3 className="mb-6 font-mono text-sm uppercase text-muted-foreground">Socials</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { name: "LinkedIn", href: "https://linkedin.com/in/awabelkhalil" },
                    { name: "GitHub", href: "https://github.com/awabelkhalil" },
                    { name: "Instagram", href: "https://instagram.com/awabelkhalil" },
                    { name: "Twitter", href: "https://twitter.com/awabelkhalil" },
                  ].map((social) => (
                    <Link
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      className="group flex items-center gap-2 text-xl font-medium transition-colors hover:text-primary"
                    >
                      {social.name}
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-6 font-mono text-sm uppercase text-muted-foreground">Location</h3>
                <div className="flex items-center gap-2 text-xl font-medium">
                  <MapPin className="h-5 w-5 text-primary" />
                  Istanbul, Turkey
                </div>
                <div className="mt-2 text-muted-foreground">
                  (GMT+3)
                </div>
              </div>
            </div>

            <div className="pt-8 md:pt-16">
              <Button asChild size="lg" className="h-16 px-8 text-lg rounded-full">
                <Link href="/rate-calculator">
                  Start a Project
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function AnimateCopy({ copied }: { copied: boolean }) {
  return (
    <div className="relative h-full w-full">
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: copied ? 0 : 1, scale: copied ? 0.5 : 1 }}
        className="absolute inset-0"
      >
        <Copy className="h-6 w-6" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: copied ? 1 : 0, scale: copied ? 1 : 0.5 }}
        className="absolute inset-0 text-primary"
      >
        <span className="font-mono text-xs font-bold uppercase">Copied!</span>
      </motion.div>
    </div>
  );
}
