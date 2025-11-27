"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageSquare, X, Send } from "lucide-react";

interface WhatsAppFormProps {
  onClose: () => void;
}

export default function WhatsAppForm({ onClose }: WhatsAppFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsSubmitting(true);

    // Format visitor's phone number for the message
    const formattedNumber = phoneNumber.replace(/\D/g, "");
    
    // Your WhatsApp number (from contact section)
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

  return (
    <Card className="fixed bottom-24 right-4 z-50 w-[320px] border-border/40 bg-card/95 backdrop-blur shadow-xl sm:bottom-28 sm:right-6 sm:w-[360px]">
      <div className="p-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Chat on WhatsApp</h3>
              <p className="text-xs text-muted-foreground">
                Quick contact via WhatsApp
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
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
              className="w-full"
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Enter your number and we'll open WhatsApp
            </p>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !phoneNumber.trim()}
            className="w-full"
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
        </form>
      </div>
    </Card>
  );
}

