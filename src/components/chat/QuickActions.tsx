"use client";

import { Button } from "@/components/ui/button";
import { Calculator, Mail, Briefcase, DollarSign } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useWhatsApp } from "./WhatsAppContext";

interface QuickActionsProps {
  onActionClick?: (action: string) => void;
}

export default function QuickActions({ onActionClick }: QuickActionsProps) {
  const router = useRouter();
  const { openWhatsApp } = useWhatsApp();

  const handleAction = (action: string, path: string) => {
    if (onActionClick) {
      onActionClick(action);
    }
    router.push(path);
  };

  const handleWhatsApp = () => {
    if (onActionClick) {
      onActionClick("whatsapp");
    }
    openWhatsApp();
  };

  return (
    <nav
      className="flex flex-wrap gap-2 justify-center"
      aria-label="Quick actions"
      role="navigation"
    >
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-xs border-[#25D366]/30 hover:bg-[#25D366]/10 hover:border-[#25D366]"
        onClick={handleWhatsApp}
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="h-3.5 w-3.5 text-[#25D366]" aria-hidden="true" />
        WhatsApp
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-xs"
        onClick={() => handleAction("get_quote", "/rate-calculator")}
        aria-label="Get a quote using the rate calculator"
      >
        <Calculator className="h-3.5 w-3.5" aria-hidden="true" />
        Get Quote
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-xs"
        onClick={() => handleAction("view_portfolio", "/projects")}
        aria-label="View portfolio projects"
      >
        <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
        Portfolio
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-xs"
        onClick={() => handleAction("contact", "/#contact")}
        aria-label="Go to contact section"
      >
        <Mail className="h-3.5 w-3.5" aria-hidden="true" />
        Contact
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-xs"
        onClick={() => handleAction("pricing", "/rate-calculator")}
        aria-label="View pricing information"
      >
        <DollarSign className="h-3.5 w-3.5" aria-hidden="true" />
        Pricing
      </Button>
    </nav>
  );
}
