"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// WhatsApp number from environment or default
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905541759945";

export default function WhatsAppModal({ isOpen, onClose }: WhatsAppModalProps) {
  const t = useTranslations('chat.whatsappModal');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on escape key and manage focus
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      // Focus input when modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Trap focus within modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    modal.addEventListener("keydown", handleTabKey);
    return () => modal.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save lead to database
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "whatsapp",
          phone: phoneNumber || undefined,
          message: "Initiated WhatsApp contact",
        }),
      });
    } catch (error) {
      console.error("Error saving lead:", error);
    }

    // Create message, include phone only if provided
    const message = encodeURIComponent(
      phoneNumber.trim()
        ? `Hi! I'm interested in your web design services. My phone number is: ${phoneNumber}`
        : `Hi! I'm interested in your web design services.`
    );

    // Open WhatsApp with configured number and pre-filled message
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

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
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="whatsapp-modal-title"
        aria-describedby="whatsapp-modal-description"
        className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] duration-200"
      >
        <div className="rounded-2xl border border-border/40 bg-card p-6 shadow-2xl">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366]"
                aria-hidden="true"
              >
                <WhatsAppIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2
                  id="whatsapp-modal-title"
                  className="text-xl font-semibold text-foreground"
                >
                  {t('title')}
                </h2>
                <p
                  id="whatsapp-modal-description"
                  className="text-sm text-muted-foreground"
                >
                  {t('description')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="whatsapp-phone"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                {t('phoneLabel')}
              </label>
              <Input
                id="whatsapp-phone"
                ref={inputRef}
                type="tel"
                placeholder={t('phonePlaceholder')}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-12 text-base"
                aria-describedby="phone-hint"
              />
              <p id="phone-hint" className="mt-2 text-xs text-muted-foreground">
                {t('phoneHint')}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#25D366] hover:bg-[#128C7E]"
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  t('opening')
                ) : (
                  <>
                    <Send className="me-2 h-4 w-4" aria-hidden="true" />
                    {t('openWhatsApp')}
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
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#25D366] underline-offset-4 hover:underline"
              >
                {t('chatDirectly')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
