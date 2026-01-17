"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import WhatsAppModal from "./WhatsAppModal";

interface WhatsAppContextType {
  openWhatsApp: () => void;
  closeWhatsApp: () => void;
  isOpen: boolean;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export function WhatsAppProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openWhatsApp = () => setIsOpen(true);
  const closeWhatsApp = () => setIsOpen(false);

  return (
    <WhatsAppContext.Provider value={{ openWhatsApp, closeWhatsApp, isOpen }}>
      {children}
      <WhatsAppModal isOpen={isOpen} onClose={closeWhatsApp} />
    </WhatsAppContext.Provider>
  );
}

export function useWhatsApp() {
  const context = useContext(WhatsAppContext);
  if (context === undefined) {
    throw new Error("useWhatsApp must be used within a WhatsAppProvider");
  }
  return context;
}

