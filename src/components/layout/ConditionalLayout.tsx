"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatWidget from "@/components/chat/ChatWidget";

export function ConditionalLayout() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return null;
  }

  return (
    <>
      <Navbar />
      <ChatWidget />
    </>
  );
}

export function ConditionalFooter() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return null;
  }

  return <Footer />;
}
