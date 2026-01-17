"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Mail, MessageSquare, Phone } from "lucide-react";
import Link from "next/link";
import { useWhatsApp } from "@/components/chat/WhatsAppContext";
import {
  trackFormSubmission,
  trackContactAction,
  trackLeadGeneration,
  trackContactClick,
} from "@/lib/gtm";

const Contact = () => {
  const { openWhatsApp } = useWhatsApp();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    projectType: "website",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

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
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setIsSubmitted(true);

      // Track form submission
      trackFormSubmission("contact_form", formState.projectType);
      trackLeadGeneration("contact_page", formState.projectType);

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormState({
          name: "",
          email: "",
          phone: "",
          message: "",
          projectType: "website",
        });
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
    <section
      id="contact"
      className="relative w-full overflow-clip bg-muted/30 py-20"
    >
      {/* Background decorative elements */}
      <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-primary/10 blur-3xl"></div>

      <div className="container relative mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
            Contact Me
          </h2>
          <h3 className="mt-2 text-3xl font-bold">
            Let's Discuss Your Project
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Ready to elevate your online presence? Fill out the form below and
            I'll get back to you within 24 hours to discuss how we can work
            together.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {/* Contact Info Cards */}
          <div className="flex flex-col gap-6">
            <Card className="border-border/40 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Email</h4>
                  <Link
                    href="mailto:awabe.adam@gmail.com"
                    className="text-sm text-muted-foreground hover:text-primary"
                    onClick={() => {
                      trackContactAction("email_click", "email");
                      trackContactClick("email", "contact_card");
                    }}
                  >
                    awabe.adam@gmail.com
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Phone</h4>
                  <Link
                    href="tel:+905541759945"
                    className="text-sm text-muted-foreground hover:text-primary"
                    onClick={() => {
                      trackContactAction("phone_click", "phone");
                      trackContactClick("phone", "contact_card");
                    }}
                  >
                    +90 554 175 9945
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer border-border/40 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:shadow-md"
              onClick={() => {
                trackContactAction("whatsapp_click", "whatsapp");
                trackContactClick("whatsapp", "contact_card");
                openWhatsApp();
              }}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">WhatsApp</h4>
                  <span className="text-sm text-muted-foreground hover:text-primary">
                    Message on WhatsApp
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                      <Check className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Message Sent!</h3>
                    <p className="mt-2 text-muted-foreground">
                      Thank you for reaching out. I'll get back to you as soon
                      as possible.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    method="POST"
                    action="/api/contact"
                  >
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Full Name <span className="text-primary">*</span>
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email <span className="text-primary">*</span>
                        </label>
                        <Input
                          id="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          type="email"
                          placeholder="Your email"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formState.phone}
                          onChange={handleChange}
                          placeholder="Your phone number"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="projectType"
                          className="text-sm font-medium"
                        >
                          Project Type <span className="text-primary">*</span>
                        </label>
                        <select
                          id="projectType"
                          name="projectType"
                          value={formState.projectType}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        >
                          <option value="website">Website Design</option>
                          <option value="branding">Brand Identity</option>
                          <option value="ui-ux">UI/UX Design</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Project Details <span className="text-primary">*</span>
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="Tell me about your project and goals"
                        rows={5}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>

                    {error && (
                      <div className="mt-2 text-center text-sm text-red-500">
                        {error}
                      </div>
                    )}

                    <p className="text-center text-xs text-muted-foreground">
                      By submitting this form, you agree to be contacted about
                      your project. I respect your privacy and will never share
                      your information.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
