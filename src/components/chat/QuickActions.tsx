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
    <div className="flex flex-wrap gap-2 justify-center">
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-xs border-[#25D366]/30 hover:bg-[#25D366]/10 hover:border-[#25D366]"
        onClick={handleWhatsApp}
      >
        <FaWhatsapp className="h-3.5 w-3.5 text-[#25D366]" />
        WhatsApp
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-xs"
        onClick={() => handleAction("get_quote", "/rate-calculator")}
      >
        <Calculator className="h-3.5 w-3.5" />
        Get Quote
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-xs"
        onClick={() => handleAction("view_portfolio", "/projects")}
      >
        <Briefcase className="h-3.5 w-3.5" />
        Portfolio
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-xs"
        onClick={() => handleAction("contact", "/#contact")}
      >
        <Mail className="h-3.5 w-3.5" />
        Contact
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-xs"
        onClick={() => handleAction("pricing", "/rate-calculator")}
      >
        <DollarSign className="h-3.5 w-3.5" />
        Pricing
      </Button>
    </div>
  );
}

