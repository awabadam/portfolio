"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppModal({ isOpen, onClose }: WhatsAppModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsSubmitting(true);

    // Save lead to database
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "whatsapp",
          phone: phoneNumber,
          message: "Initiated WhatsApp contact",
        }),
      });
    } catch (error) {
      console.error("Error saving lead:", error);
    }

    // Your WhatsApp number
    const yourWhatsAppNumber = "905541759945";

    // Create message with visitor's phone number
    const message = encodeURIComponent(
      `Hi! I'm interested in your web design services. My phone number is: ${phoneNumber}`
    );

    // Open WhatsApp with your number and pre-filled message
    const whatsappUrl = `https://wa.me/${yourWhatsAppNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");

    // Reset form after a short delay
    setTimeout(() => {
      setPhoneNumber("");
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] duration-200">
        <div className="rounded-2xl border border-border/40 bg-card p-6 shadow-2xl">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366]">
                <FaWhatsapp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Chat on WhatsApp
                </h2>
                <p className="text-sm text-muted-foreground">
                  Get a quick response via WhatsApp
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="whatsapp-phone"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Your Phone Number
              </label>
              <Input
                id="whatsapp-phone"
                type="tel"
                placeholder="+90 5XX XXX XX XX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-12 text-base"
                autoFocus
                required
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Enter your number so I know how to reach you back
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !phoneNumber.trim()}
                className="flex-1 bg-[#25D366] hover:bg-[#128C7E]"
              >
                {isSubmitting ? (
                  "Opening..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Open WhatsApp
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Direct Link */}
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Or{" "}
              <a
                href="https://wa.me/905541759945"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#25D366] underline-offset-4 hover:underline"
              >
                chat directly without sharing your number
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

